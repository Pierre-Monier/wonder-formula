import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { BULMA_CSS } from "./bulma";

@customElement("wonder-sidebar")
export class WonderSidebar extends LitElement {
  static styles = [BULMA_CSS];

  render() {
    return html` <p class="toto">Sidebar</p> `;
  }
}
