import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import Pages from "../shared/pages";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { espresso } from "thememirror";

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
    extensions: [basicSetup, espresso],
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

  getValue() {
    const currentValue = this.view?.state.doc.toString() ?? "";
    return currentValue;
  }

  setValue(value: string) {
    if (!this.view) {
      this._initValue = value;
      return;
    }

    const currentValue = this.getValue();

    if (currentValue === value) return;

    this.view.dispatch({
      changes: { from: 0, to: currentValue.length, insert: value },
    });
  }

  protected firstUpdated(): void {
    if (!this.view) {
      console.error("View is not initialized yet");
      return;
    }

    this._editor.appendChild(this.view.dom);
  }

  private getDisplay() {
    if (this.shouldDisplay && this.page !== Pages.Unknown) return "block";

    return "none";
  }

  private getMarginTop() {
    if (this.page === Pages.Edit) return "5px";

    return "0px";
  }

  render() {
    return html`
      <div
        style="display: ${this.getDisplay()}; margin-top: ${this.getMarginTop()};}"
        id="editor"
      ></div>
    `;
  }
}
