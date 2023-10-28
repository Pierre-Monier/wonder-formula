import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import Pages from "../shared/pages";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { espresso } from "thememirror";
import { formatSource, sformula } from "../lang-sformula";

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

  @property({
    attribute: "should-display",
    reflect: true,
  })
  shouldDisplay = false;

  @property({ reflect: true }) page = Pages.Unknown;

  @query("#editor")
  _editor!: HTMLDivElement;

  @state()
  private _validationStatus = WonderEditor.loadingValidationStatus;

  static get loadingValidationStatus() {
    return {
      currentStatus: ValidationState.Loading,
      text: "...",
    };
  }

  static get defaultErrorValidationStatus() {
    return {
      currentStatus: ValidationState.Invalid,
      text: "We can't check the syntax of this formula. Please use the default Salesforce editor.",
    };
  }

  state = EditorState.create({
    extensions: [basicSetup, espresso, sformula()],
  });

  private _initValue?: string;

  private _checkSyntaxData?: CheckSyntaxDate;

  private _view?: EditorView;

  get view() {
    if (this._editor === null) {
      return;
    }

    if (!this._view) {
      this._view = new EditorView({
        state: this.state,
        parent: this._editor,
      });

      if (this._initValue) {
        this.setValue(this._initValue);
      }
    }

    return this._view;
  }

  protected firstUpdated(): void {
    if (!this.view) {
      console.error("View is not initialized yet");
      return;
    }

    this._editor.appendChild(this.view.dom);
    this.addEventListener("keydown", (e) => {
      const { ctrlKey, metaKey, code } = e;

      if (code === "KeyS" && (ctrlKey || metaKey)) {
        e.preventDefault();
        void this._format();
      }
    });
    void this._validate();
  }

  getValue() {
    const currentValue = this.view?.state.doc.toString() ?? "";
    return currentValue;
  }

  setValue(value: string, cursorOffset?: number) {
    if (!this.view) {
      this._initValue = value;
      return;
    }

    const currentValue = this.getValue();

    if (currentValue === value) return;

    this.view.dispatch({
      changes: { from: 0, to: currentValue.length, insert: value },
      selection:
        cursorOffset === undefined
          ? undefined
          : { anchor: cursorOffset, head: cursorOffset },
    });
  }

  private async _format() {
    if (!this.view) return;

    const cursorOffset = this.view.state.selection.main.head;

    const formattedValue = await formatSource(this.getValue(), cursorOffset);

    this.setValue(formattedValue.formatted, formattedValue.cursorOffset);
  }

  setCheckSyntaxData(data: CheckSyntaxDate) {
    this._checkSyntaxData = data;
  }

  private async _validate() {
    if (!this._checkSyntaxData) {
      this._validationStatus = WonderEditor.defaultErrorValidationStatus;
      return;
    }

    this._validationStatus = WonderEditor.loadingValidationStatus;

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
      this._validationStatus = WonderEditor.defaultErrorValidationStatus;
      return;
    }

    const validationDataElement = validationStatus.firstElementChild;
    const isValid = validationDataElement?.classList.contains("validStyle");
    const text = validationDataElement?.textContent;

    if (!text) {
      this._validationStatus = WonderEditor.defaultErrorValidationStatus;
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
        id="editor"
      >
        <button @click=${() => this._format()}>Format</button>
        <button @click=${() => this._validate()}>Check Syntax</button>
        <span style="color: ${this._getValidationColorText()}"
          >${this._validationStatus.text}</span
        >
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

  private _getValidationColorText() {
    switch (this._validationStatus.currentStatus) {
      case ValidationState.Loading:
        return "grey";
      case ValidationState.Valid:
        return "green";
      case ValidationState.Invalid:
        return "red";
    }
  }
}

type CheckSyntaxDate = {
  url: string;
  method: string;
  getFormData: () => FormData;
  valueKey: string;
};

enum ValidationState {
  Loading,
  Valid,
  Invalid,
}
