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

  render() {
    return html`
      <textarea
        style="display: ${this.shouldDisplay ? "block" : "none"}"
        rows="20"
        cols="80"
        maxlength="3900"
        .value=${this.value}
        @input=${(event: Event) => this.handleTextareaInput(event)}
      >
      </textarea>
    `;
  }

  handleTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.value = textarea.value;
  }
}
