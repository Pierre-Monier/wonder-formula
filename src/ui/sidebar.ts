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

    const getKey = (node: FieldTreeNode): string => {
      if (node.parent?.key.charAt(0) === "$") {
        return getKey(node.parent) + "." + node.key;
      } else {
        return node.key;
      }
    };

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
      const key = getKey(node);

      return {
        name: node.labelName,
        key: key,
        onclick: () => this._insertResource(key),
        children: node.isLeaf ? undefined : node.children?.map(nodeToResource),
        descriptions: getDescriptions(node, key),
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
    return html`<div class="tabs is-fullwidth">
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
      <div>
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
                    .resources=${this._getOperatorResources()}
                    .menuName=${"Operators"}
                  ></wonder-resource-list>
                </ul>
              </aside>
            `
          : html`<p>Feedback</p>`}
      </div> `;
  }
}
