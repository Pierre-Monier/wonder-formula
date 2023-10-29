import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import Pages from "../shared/pages";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { espresso } from "thememirror";
import { formatSource, sformula } from "../lang-sformula";
import { FieldTreeNode } from "../shared/field-tree";

import "./button";
import "./validation-status";

@customElement("wonder-editor")
export class WonderEditor extends LitElement {
  static styles = css`
    .cm-content {
      height: 20em;
    }

    .cm-gutters {
      height: 20em !important;
    }

    .cm-scroller {
      overflow: auto;
    }

    .cm-focused {
      outline: none !important;
    }
  `;

  private static get _loadingValidationStatus() {
    return {
      currentStatus: ValidationState.Loading,
      text: "...",
    };
  }

  private static get _defaultErrorValidationStatus() {
    return {
      currentStatus: ValidationState.Invalid,
      text: "We can't check the syntax of this formula. Please use the default Salesforce editor.",
    };
  }

  private static get _emptyValueErrorValidationStatus() {
    return {
      currentStatus: ValidationState.Invalid,
      text: "Formula is empty.",
    };
  }

  private static get _autoFormatBounce() {
    return 600;
  }

  @property({
    attribute: "should-display",
    reflect: true,
  })
  shouldDisplay = false;

  @property({ reflect: true }) page = Pages.Unknown;

  @query("#editor")
  _editor!: HTMLDivElement;

  private _validationTimeout?: NodeJS.Timeout;

  @state()
  private _validationStatus = WonderEditor._loadingValidationStatus;

  private _editorState = EditorState.create({
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          this._autoFormat();
        }
      }),
      sformula(),
      espresso,
    ],
  });

  private _initValue?: string;

  private _checkSyntaxData?: CheckSyntaxDate;

  @state()
  // TODO: this should be pass by content script
  private _fieldTreeRoot?: FieldTreeNode[];

  setFieldTreeRoot(fieldTreeRoot: FieldTreeNode[]) {
    this._fieldTreeRoot = fieldTreeRoot;
  }

  private __view?: EditorView;

  private get _view() {
    if (this._editor === null) {
      return;
    }

    if (!this.__view) {
      this.__view = new EditorView({
        state: this._editorState,
        parent: this._editor,
      });

      if (this._initValue) {
        this.setValue(this._initValue);
      }
    }

    return this.__view;
  }

  protected firstUpdated(): void {
    if (!this._view) {
      console.error("View is not initialized yet");
      return;
    }

    this._editor.appendChild(this._view.dom);
    this._registerKeyboardEvents();
    void this._validate();

    console.log(this._fieldTreeRoot);
  }

  private _registerKeyboardEvents() {
    this.addEventListener("keydown", (e) => {
      const { ctrlKey, metaKey, code } = e;

      if (code === "KeyS" && (ctrlKey || metaKey)) {
        e.preventDefault();
        void this._format();
      }
    });
  }

  getValue() {
    const currentValue = this._view?.state.doc.toString() ?? "";
    return currentValue;
  }

  setValue(value: string, cursorOffset?: number) {
    if (!this._view) {
      this._initValue = value;
      return;
    }

    const currentValue = this.getValue();

    if (currentValue === value) return;

    this._view.dispatch({
      changes: { from: 0, to: currentValue.length, insert: value },
      selection:
        cursorOffset === undefined
          ? undefined
          : { anchor: cursorOffset, head: cursorOffset },
    });
  }

  private _autoFormat() {
    clearTimeout(this._validationTimeout);
    this._validationTimeout = setTimeout(() => {
      void this._validate();
    }, WonderEditor._autoFormatBounce);
  }

  private async _format() {
    if (!this._view) {
      console.error("Formatting but view is not initialized yet");
      return;
    }

    const cursorOffset = this._view.state.selection.main.head;

    const formattedValue = await formatSource(this.getValue(), cursorOffset);

    this.setValue(formattedValue.formatted, formattedValue.cursorOffset);
  }

  setCheckSyntaxData(data: CheckSyntaxDate) {
    this._checkSyntaxData = data;
  }

  private async _validate() {
    if (!this._checkSyntaxData) {
      this._validationStatus = WonderEditor._defaultErrorValidationStatus;
      console.error("Validate but validation data is not set");
      return;
    }

    this._validationStatus = WonderEditor._loadingValidationStatus;

    const formData = this._checkSyntaxData.getFormData();

    formData.set(this._checkSyntaxData.valueKey, this.getValue());

    const result = await fetch(this._checkSyntaxData.url, {
      method: this._checkSyntaxData.method,
      body: formData,
    });

    const body = await result.text();

    const newDocument = document.createElement("html");
    newDocument.innerHTML = body;

    const validationStatus =
      newDocument.querySelector<HTMLSpanElement>("#validationStatus");

    if (!validationStatus) {
      this._validationStatus = WonderEditor._defaultErrorValidationStatus;
      console.error("Validate but validation status is not found");
      return;
    }

    const validationDataElement = validationStatus.firstElementChild;
    const isValid = validationDataElement?.classList.contains("validStyle");
    const text = validationDataElement?.textContent;

    if (!text && !this.getValue()) {
      this._validationStatus = WonderEditor._emptyValueErrorValidationStatus;
      return;
    } else if (!text) {
      this._validationStatus = WonderEditor._defaultErrorValidationStatus;
      console.error("Validate but validation text is not found");
      return;
    }

    this._validationStatus = {
      currentStatus: isValid ? ValidationState.Valid : ValidationState.Invalid,
      text: text,
    };
  }

  render() {
    return html`
      <div
        style="display: ${this._getDisplay()}; margin-top: ${this._getMarginTop()};}"
      >
        <wonder-button .onclick=${() => this._format()}>
          Format <i>(Ctrl + s)</i>
        </wonder-button>
        <div id="editor"></div>
        <wonder-validation-status
          .text=${this._validationStatus.text}
          .currentStatus=${this._validationStatus.currentStatus}
        ></wonder-validation-status>
      </div>
    `;
  }

  private _getDisplay() {
    if (this.shouldDisplay && this.page !== Pages.Unknown) return "block";

    return "none";
  }

  private _getMarginTop() {
    if (this.page === Pages.Edit) return "5px";

    return "0px";
  }
}

type CheckSyntaxDate = {
  url: string;
  method: string;
  getFormData: () => FormData;
  valueKey: string;
};

export enum ValidationState {
  Loading,
  Valid,
  Invalid,
}
