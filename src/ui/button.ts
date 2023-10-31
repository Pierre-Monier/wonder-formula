import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BULMA_CSS } from "./bulma";

@customElement("wonder-button")
export class WonderButton extends LitElement {
  static styles = [BULMA_CSS];

  @property()
  onclick!: () => void;

  render() {
    return html`
    <div class="m-1">
      <button @click=${() =>
        this.onclick()} class="button is-outline is-small"><slot></slot</button>
    </div>
    `;
  }
}
