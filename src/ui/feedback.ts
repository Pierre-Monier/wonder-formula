import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { BULMA_CSS } from "./bulma";

@customElement("wonder-feedback")
export class WonderFeedback extends LitElement {
  static styles = [BULMA_CSS];

  render() {
    return html`
      <p class="is-size-5">
        You have some feedbacks ?
        <a href="mailto:pierre.monier.dev@gmail.com" target="_blank"
          >Send an Email</a
        >
      </p>
    `;
  }
}
