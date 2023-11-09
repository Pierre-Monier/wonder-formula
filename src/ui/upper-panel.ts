import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BULMA_CSS } from "./bulma";
import { reportErrorGA } from "../shared/firebase";

@customElement("wonder-upper-panel")
export class WonderUpperPanel extends LitElement {
  static styles = [BULMA_CSS];

  @property()
  showFormat!: boolean;

  @property()
  isShowingDiff!: boolean;

  private _format?: () => Promise<void>;
  private _toggleDiff?: () => void;

  private _tryToFormat() {
    if (!this._format) {
      void reportErrorGA("No format function set");
      return;
    }

    void this._format();
  }

  private _tryToToggleDiff() {
    if (!this._toggleDiff) {
      void reportErrorGA("No toggleDiff function set");
      return;
    }

    this._toggleDiff();
  }

  init(format: () => Promise<void>, toggleDiff: () => void) {
    this._format = format;
    this._toggleDiff = toggleDiff;
  }

  render() {
    return html`
      <div class="m-1">
        <button
          @click=${() => this._tryToToggleDiff()}
          class="button is-outline is-small ${this.isShowingDiff
            ? "is-primary"
            : ""}"
        >
          Diff
        </button>

        ${this.showFormat
          ? html`<button
              @click=${() => this._tryToFormat()}
              class="button is-outline is-small"
            >
              Format
            </button>`
          : html``}
      </div>
    `;
  }
}
