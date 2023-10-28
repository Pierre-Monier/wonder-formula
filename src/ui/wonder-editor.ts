import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
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

  state = EditorState.create({
    extensions: [basicSetup, espresso, sformula()],
  });

  private _initValue?: string;

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
        void this.format();
      }
    });
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

  private async format() {
    if (!this.view) return;

    const cursorOffset = this.view.state.selection.main.head;

    const formattedValue = await formatSource(this.getValue(), cursorOffset);

    this.setValue(formattedValue.formatted, formattedValue.cursorOffset);
  }

  render() {
    return html`
      <div
        style="display: ${this.getDisplay()}; margin-top: ${this.getMarginTop()};}"
        id="editor"
      >
        <button @click=${() => this.format()}>Format</button>
      </div>
    `;
  }

  private getDisplay() {
    if (this.shouldDisplay && this.page !== Pages.Unknown) return "block";

    return "none";
  }

  private getMarginTop() {
    if (this.page === Pages.Edit) return "5px";

    return "0px";
  }
}
