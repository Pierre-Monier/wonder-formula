import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BULMA_CSS } from "./bulma";
import { wonderStore } from "./store";
import { EditorResource } from "./type";
import { WonderEditor } from "./editor";
import { FieldTreeNode } from "../shared/wonder-store";

@customElement("wonder-sidebar")
export class WonderSidebar extends LitElement {
  static styles = [
    BULMA_CSS,
    css`
      .menu-label {
        text-transform: none !important;
      }
    `,
  ];

  @state()
  private _activeTab = 0;

  @state()
  private _activeResource?: number;

  private _getFieldResources() {
    const { fieldTreeRoot } = wonderStore;
    if (!fieldTreeRoot) return [];

    const getDescriptions = (node: FieldTreeNode, key: string): string[] => {
      const descriptions = [];

      if (node.attributes?.type) {
        const typeDescription = `TYPE: ${node.attributes.type}`;
        descriptions.push(typeDescription);
      }

      const keyDescription = `KEY: ${key}`;
      descriptions.push(keyDescription);

      return descriptions;
    };

    const nodeToResource = (node: FieldTreeNode): EditorResource => {
      return {
        name: node.labelName,
        key: node.key,
        onclick: () => this._insertResource(node.key),
        children: node.isLeaf ? undefined : node.children?.map(nodeToResource),
        descriptions: getDescriptions(node, node.key),
      };
    };

    return fieldTreeRoot.map(nodeToResource);
  }

  private _getOperatorResources() {
    const { operatorTreeRoot } = wonderStore;
    if (!operatorTreeRoot) return [];

    return operatorTreeRoot.map((node) => ({
      name: node.key,
      key: node.key,
      onclick: () => this._insertResource(node.key),
      descriptions: node.description ? [node.description] : undefined,
    }));
  }

  private _getFunctionResources() {
    const { functionsTreeRoot } = wonderStore;
    if (!functionsTreeRoot) return [];

    return functionsTreeRoot
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((node) => ({
        name: node.name,
        key: node.key,
        onclick: () => this._insertResource(node.key),
        descriptions: [node.description],
        onhelp: node.onhelp,
      }));
  }

  private _insertResource(resource: string) {
    const editor = document.querySelector<WonderEditor>("wonder-editor");
    if (!editor) {
      console.error("editor not found while inserting a resource");
      return;
    }

    editor.insertResource(resource);
  }

  private _toggleActiveResource(index: number) {
    this._activeResource = this._activeResource === index ? undefined : index;
  }

  render() {
    return html`
      <div class="tabs is-fullwidth">
        <ul>
          <li
            class=${this._activeTab === 0 ? "is-active" : ""}
            @click=${() => (this._activeTab = 0)}
          >
            <a>Resources</a>
          </li>
          <li
            class=${this._activeTab === 1 ? "is-active" : ""}
            @click=${() => (this._activeTab = 1)}
          >
            <a>Feedback</a>
          </li>
        </ul>
      </div>
      <div style="overflow-y: scroll; max-height: 80%;">
        ${this._activeTab === 0
          ? html`
              <aside class="menu">
                <ul class="menu-list">
                  <wonder-resource-list
                    .isActive=${this._activeResource === 0}
                    .onclick=${() => this._toggleActiveResource(0)}
                    .resources=${this._getFieldResources()}
                    .menuName=${"Fields"}
                  ></wonder-resource-list>
                  <wonder-resource-list
                    .isActive=${this._activeResource === 1}
                    .onclick=${() => this._toggleActiveResource(1)}
                    .resources=${this._getFunctionResources()}
                    .menuName=${"Functions"}
                  ></wonder-resource-list>
                  <wonder-resource-list
                    .isActive=${this._activeResource === 2}
                    .onclick=${() => this._toggleActiveResource(2)}
                    .resources=${this._getOperatorResources()}
                    .menuName=${"Operators"}
                  ></wonder-resource-list>
                </ul>
              </aside>
            `
          : html`<p>Feedback</p>`}
      </div>
    `;
  }
}
