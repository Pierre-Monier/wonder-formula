import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BULMA_CSS } from "./bulma";

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
      console.error("No format function set");
      return;
    }

    void this._format();
  }

  private _tryToToggleDiff() {
    if (!this._toggleDiff) {
      console.error("No toggleDiff function set");
      return;
    }

    this._toggleDiff();
  }

  init(format: () => Promise<void>, toggleDiff: () => void) {
    this._format = format;
    this._toggleDiff = toggleDiff;

    console.log("init", this.isShowingDiff);
  }

  render() {
    return html`
      <div class="m-1">
        ${this.showFormat
          ? html`<button
              @click=${() => this._tryToFormat()}
              class="button is-outline is-small"
            >
              Format
            </button>`
          : html``}

        <button
          @click=${() => this._tryToToggleDiff()}
          class="button is-outline is-small ${this.isShowingDiff
            ? "is-primary"
            : ""}"
        >
          Diff
        </button>
      </div>
    `;
  }
}
