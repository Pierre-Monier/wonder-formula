import { LitElement, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import Pages from "../shared/pages";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";

@customElement("wonder-editor")
export class WonderEditor extends LitElement {
  @property({
    attribute: "should-display",
    reflect: true,
  })
  shouldDisplay = false;

  @property({ reflect: true }) page = Pages.Unknown;

  @query("#editor")
  _editor!: HTMLDivElement;

  state = EditorState.create();
  view = new EditorView({
    state: this.state,
  });

  getValue() {
    const currentValue = this.view.state.doc.toString();
    return currentValue;
  }

  setValue(value: string) {
    const currentValue = this.getValue();

    if (currentValue == value) return;

    this.view.dispatch({
      changes: { from: 0, to: currentValue.length, insert: value },
    });
  }

  protected firstUpdated(): void {
    this._editor.appendChild(this.view.dom);
  }

  render() {
    return html`
      <div
        style="display: ${this.getDisplay()}; margin-top: ${this.getMarginTop()};}"
        id="editor"
      ></div>
    `;
  }

  private getDisplay() {
    if (this.shouldDisplay && this.page != Pages.Unknown) return "block";

    return "none";
  }

  private getMarginTop() {
    if (this.page == Pages.Edit) return "5px";

    return "0px";
  }
}
