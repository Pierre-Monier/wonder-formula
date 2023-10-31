import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import Pages from "../shared/pages";
import { EditorView, keymap, showPanel } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { espresso } from "thememirror";
import { formatSource, sformula } from "../lang-sformula";
import { FieldTreeNode } from "../shared/field-tree";
import { BULMA_CSS } from "./bulma";
import { CheckSyntaxData } from "./type";
import { WonderValidationStatus } from "./validation-status";
import { wonderStore } from "./store";

import "./button";
import "./sidebar";
import "./validation-status";
import "./resource-list";

@customElement("wonder-editor")
export class WonderEditor extends LitElement {
  static styles = [
    BULMA_CSS,
    css`
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
    `,
  ];

  @property({
    attribute: "should-display",
    reflect: true,
  })
  shouldDisplay = false;

  @query("#editor")
  _editor!: HTMLDivElement;

  private _editorState = EditorState.create({
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      sformula(),
      espresso,
      showPanel.of(() => {
        const dom = document.createElement(
          "wonder-validation-status",
        ) as WonderValidationStatus;

        return {
          dom,
          update: (update) => {
            if (update.docChanged) {
              dom.autoFormat(this.getValue());
            }
          },
        };
      }),
    ],
  });

  private _initValue?: string;

  init(
    fieldTreeRoot?: FieldTreeNode[],
    checkSyntaxData?: CheckSyntaxData,
    currentPage?: Pages,
  ) {
    if (fieldTreeRoot) {
      wonderStore.fieldTreeRoot = fieldTreeRoot;
    }

    if (checkSyntaxData) {
      wonderStore.checkSyntaxData = checkSyntaxData;
    }

    if (currentPage) {
      wonderStore.currentPage = currentPage;
    }
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

  insertResource(resource: string) {
    if (!this._view) {
      console.error("Inserting resource but view is not initialized yet");
      return;
    }

    const { head, anchor } = this._view.state.selection.main;
    const from = Math.min(head, anchor);
    const to = Math.max(head, anchor);
    const newCursorOffset = from + resource.length;

    this._view.dispatch({
      changes: {
        from: from,
        to: to,
        insert: resource,
      },
      selection: { anchor: newCursorOffset, head: newCursorOffset },
    });
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

  render() {
    return html`
      <div
        style="display: ${this._getDisplay()}; margin-top: ${this._getMarginTop()};}"
      >
        <div class="columns mb-1">
          <div id="editor" class="column"></div>
          <wonder-sidebar class="column is-one-third"></wonder-sidebar>
        </div>
        <wonder-button .onclick=${() => this._format()}> Format </wonder-button>
      </div>
    `;
  }

  private _getDisplay() {
    const { currentPage } = wonderStore;
    if (this.shouldDisplay && currentPage !== Pages.Unknown) return "block";

    return "none";
  }

  private _getMarginTop() {
    const { currentPage } = wonderStore;
    if (currentPage === Pages.Edit) return "5px";

    return "0px";
  }
}
