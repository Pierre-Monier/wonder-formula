import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("wonder-button")
export class WonderButton extends LitElement {
  @property()
  onclick!: () => void;

  render() {
    return html`
      <button @click=${() => this.onclick}><slot></slot</button>
    `;
  }
}
