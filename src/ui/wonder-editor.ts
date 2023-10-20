import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("wonder-editor")
export class WonderEditor extends LitElement {
  @property({ type: String }) tutu = "World";

  render() {
    return html` <p>Welcome to the Lit tutorial! ${this.tutu} :)</p> `;
  }
}
