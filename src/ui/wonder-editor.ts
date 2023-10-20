import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("wonder-editor")
export class WonderEditor extends LitElement {
  @property({
    attribute: "should-display",
  })
  shouldDisplay = false;

  render() {
    return html`
      <p style="display: ${this.shouldDisplay ? "block" : "none"}">
        Welcome to the Lit tutorial!
      </p>
    `;
  }
}
