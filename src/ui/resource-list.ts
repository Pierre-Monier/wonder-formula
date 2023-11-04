import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { EditorResource } from "./type";

@customElement("wonder-resource-list")
export class WonderResourceList extends LitElement {
  @property()
  resources!: EditorResource[];

  @property()
  isActive = false;

  @property()
  onclick!: () => void;

  @property()
  menuName?: string;

  @state()
  private _index?: number;

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    // Doing this to not break css encapsulation
    return this;
  }

  private _toggleIndex(index: number) {
    this._index = this._index === index ? undefined : index;
  }

  private _renderResources() {
    return html`<ul class="menu-list">
      ${this.resources.map(
        (e, i) => html`
          <li>
            <a
              @click=${() => {
                this._toggleIndex(i);
              }}
              class=${this._index === i ? "is-active" : ""}
              >${e.name}</a
            >
            ${this._index === i && e.children
              ? html`<wonder-resource-list
                  .resources=${e.children}
                  .onclick=${e.onclick}
                  .isActive=${this._index === i}
                ></wonder-resource-list>`
              : this._index === i && e.descriptions
              ? html`
                  <div class="m-3">
                    ${e.descriptions.map(
                      (description) =>
                        html` <p class="menu-label content">${description}</p>`,
                    )}
                  </div>
                  <div class="is-flex is-justify-content-center">
                    <button
                      @click=${() => {
                        e.onclick();
                      }}
                      class="button is-primary"
                    >
                      Insert
                    </button>
                    ${e.onhelp
                      ? html`<button
                          @click=${() => {
                            e.onhelp?.();
                          }}
                          class="button is-link ml-2"
                        >
                          Help
                        </button>`
                      : html``}
                  </div>
                `
              : html``}
          </li>
        `,
      )}
    </ul>`;
  }

  render() {
    return html`
      ${this.resources.length
        ? html` <li>
            ${this.menuName
              ? html`<a
                  @click=${() => this.onclick()}
                  class=${this.isActive ? "is-active" : ""}
                  >${this.menuName}</a
                >`
              : html``}
            ${this.isActive ? this._renderResources() : html``}
          </li>`
        : html`<p class="menu-label">No content.</p>`}
    `;
  }
}
