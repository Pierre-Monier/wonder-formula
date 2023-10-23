import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("wonder-editor")
export class WonderEditor extends LitElement {
  @property({
    attribute: "should-display",
    reflect: true,
  })
  shouldDisplay = false;

  @property({ reflect: true }) value = "";

  @property({ reflect: true }) page = "";

  render() {
    return html`
      <textarea
        style="display: ${this.getDisplay()}; margin-top: ${this.getMarginTop()};}"
        rows="20"
        cols="80"
        maxlength="3900"
        .value=${this.value}
        @input=${(event: Event) => this.handleTextareaInput(event)}
      >
      </textarea>
    `;
  }

  getDisplay() {
    if (this.shouldDisplay && this.page != "unknown") return "block";

    return "none";
  }

  getMarginTop() {
    if (this.page == "edit") return "5px";

    return "0px";
  }

  handleTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.value = textarea.value;
  }
}
