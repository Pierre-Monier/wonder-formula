import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { EditorView, keymap, showPanel } from "@codemirror/view";
import { Compartment, EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { espresso } from "thememirror";
import { formatSource, sformula } from "../lang-sformula";
import { BULMA_CSS } from "./bulma";
import { WonderValidationStatus } from "./validation-status";
import { wonderStore } from "./store";
import { WonderUpperPanel } from "./upper-panel";
import { MergeView } from "@codemirror/merge";
import {
  FieldTreeNode,
  FunctionsTreeNode,
  Pages,
  WonderStore,
} from "../shared/wonder-store";
import {
  CompletionSource,
  autocompletion,
  completeFromList,
} from "@codemirror/autocomplete";

import "./sidebar";
import "./validation-status";
import "./resource-list";
import "./upper-panel";

@customElement("wonder-editor")
export class WonderEditor extends LitElement {
  static styles = [
    BULMA_CSS,
    css`
      .cm-content {
        height: 20em;
      }

      .cm-gutters {
        height: 20em !important;
      }

      .cm-scroller {
        overflow: auto;
      }

      .cm-focused {
        outline: none !important;
      }
    `,
  ];

  @property({
    attribute: "should-display",
    reflect: true,
  })
  shouldDisplay = false;

  @query("#editor")
  _editor!: HTMLDivElement;

  @query("#diff")
  _diff!: HTMLDivElement;

  private static _autoCompletionCompartment = new Compartment();

  @state()
  private _isShowingDiff = false;

  private _getUpperPanelExtension = (showFormat: boolean) =>
    showPanel.of(() => {
      const dom = document.createElement(
        "wonder-upper-panel",
      ) as WonderUpperPanel;
      dom.showFormat = showFormat;
      dom.isShowingDiff = this._isShowingDiff;
      dom.init(
        () => this._format(),
        () => this._toggleDiff(),
      );

      return {
        dom,
        top: true,
      };
    });

  private _lowerPanelExtension = showPanel.of(() => {
    const dom = document.createElement(
      "wonder-validation-status",
    ) as WonderValidationStatus;

    return {
      dom,
      update: (update) => {
        if (update.docChanged) {
          dom.autoFormat(this.getValue());
        }
      },
    };
  });

  private _sharedExtensions = [
    basicSetup,
    sformula(),
    WonderEditor._autoCompletionCompartment.of([]),
    EditorState.tabSize.of(2),
    espresso,
    keymap.of([indentWithTab]),
  ];

  private _editorState = EditorState.create({
    extensions: [
      ...this._sharedExtensions,
      this._getUpperPanelExtension(true),
      this._lowerPanelExtension,
    ],
  });

  private _initValue?: string;

  init(wonderStoreData: WonderStore) {
    const {
      fieldTreeRoot,
      checkSyntaxData,
      currentPage,
      operatorTreeRoot,
      functionsTreeRoot,
    } = wonderStoreData;

    if (fieldTreeRoot) {
      wonderStore.fieldTreeRoot = fieldTreeRoot;
    }

    if (checkSyntaxData) {
      wonderStore.checkSyntaxData = checkSyntaxData;
    }

    if (currentPage) {
      wonderStore.currentPage = currentPage;
    }

    if (operatorTreeRoot) {
      wonderStore.operatorTreeRoot = operatorTreeRoot;
    }

    if (functionsTreeRoot) {
      wonderStore.functionsTreeRoot = functionsTreeRoot;
    }
  }
  private __view?: EditorView;

  private get _view() {
    if (this._editor === null) {
      return;
    }

    if (!this.__view) {
      this.__view = new EditorView({
        state: this._editorState,
        parent: this._editor,
      });

      if (this._initValue) {
        this.setValue(this._initValue);
      }
    }

    return this.__view;
  }

  private __mergeView?: MergeView;

  private get _mergeView() {
    if (this._diff === null) {
      return;
    }

    if (!this.__mergeView) {
      this.__mergeView = new MergeView({
        a: {
          doc: this._initValue,
          extensions: [
            this._getUpperPanelExtension(false),
            EditorView.editable.of(false),
            EditorState.readOnly.of(true),
            ...this._sharedExtensions,
          ],
        },
        b: {
          extensions: [
            EditorView.editable.of(false),
            EditorState.readOnly.of(true),
            ...this._sharedExtensions,
          ],
        },
        parent: this._diff,
      });
    }

    return this.__mergeView;
  }

  protected firstUpdated(): void {
    this._appendEditorView();
    this._appendDiffView();
  }

  private _appendEditorView() {
    if (!this._view) {
      console.error("Editor view is not initialized yet");
      return;
    }

    this._editor.appendChild(this._view.dom);
    this._registerAutoCompletion();
    this._registerKeyboardEvents();
  }

  private _appendDiffView() {
    if (!this._mergeView) {
      console.error("Merge view is not initialized yet");
      return;
    }

    this._diff.appendChild(this._mergeView.dom);
  }

  private _registerAutoCompletion() {
    if (!this._view) {
      console.error(
        "Trying to register auto completion but view is not initialized yet",
      );
      return;
    }

    const { functionsTreeRoot, fieldTreeRoot } = wonderStore;

    const autocompletions: CompletionSource[] = [];

    if (functionsTreeRoot) {
      autocompletions.push(
        this._registerFunctionsAutocompletion(functionsTreeRoot),
      );
    }

    if (fieldTreeRoot) {
      autocompletions.push(this._registerFieldsAutocompletion(fieldTreeRoot));
    }

    this._view.dispatch({
      effects: WonderEditor._autoCompletionCompartment.reconfigure(
        autocompletion({
          override: autocompletions,
        }),
      ),
    });
  }

  private _registerFieldsAutocompletion(fieldTreeRoot: FieldTreeNode[]) {
    const linearFieldTreeRoor = fieldTreeRoot.flatMap((node) => {
      if (!node.children) {
        return node;
      }

      if (node.key.charAt(0) === "$") {
        return [node, ...node.children];
      }

      return node.children;
    });

    const nodeToAutocompletion = (node: FieldTreeNode) => {
      return {
        label: node.key,
        displayLabel: node.labelName,
        type: "variable",
        section: node.parent?.key,
        detail: node.attributes?.type,
      };
    };

    return completeFromList(linearFieldTreeRoor.map(nodeToAutocompletion));
  }

  private _registerFunctionsAutocompletion(
    functionsTreeRoot: FunctionsTreeNode[],
  ) {
    const findNewCursorPosition = (
      label: string,
      from: number,
      firstParenthesisIndex: number,
      secondParenthesisIndex: number,
    ) => {
      const firstCommaIndex = label.indexOf(",");

      if (firstCommaIndex === -1) {
        return {
          anchor: from + firstParenthesisIndex + 1,
          head: from + secondParenthesisIndex,
        };
      }

      return {
        anchor: from + firstParenthesisIndex + 1,
        head: from + firstCommaIndex,
      };
    };

    return completeFromList(
      functionsTreeRoot.map((e) => ({
        displayLabel: e.name,
        label: e.key,
        detail: e.description,
        type: "function",
        apply: (_, completion, from, to) => {
          const firstParenthesisIndex = completion.label.indexOf("(");
          const secondParenthesisIndex = completion.label.indexOf(")");
          const shouldPassNewCursorPosition =
            firstParenthesisIndex - secondParenthesisIndex !== -1;
          this.insertResource(
            completion.label,
            { from, to },
            shouldPassNewCursorPosition
              ? findNewCursorPosition(
                  completion.label,
                  from,
                  firstParenthesisIndex,
                  secondParenthesisIndex,
                )
              : undefined,
          );
        },
      })),
    );
  }

  private _registerKeyboardEvents() {
    this.addEventListener("keydown", (e) => {
      const { ctrlKey, metaKey, code } = e;

      if (code === "KeyS" && (ctrlKey || metaKey)) {
        e.preventDefault();
        void this._format();
      }
    });
  }

  getValue() {
    const currentValue = this._view?.state.doc.toString() ?? "";
    return currentValue;
  }

  setValue(value: string, cursorOffset?: number) {
    if (!this._view) {
      this._initValue = value;
      return;
    }

    const currentValue = this.getValue();

    if (currentValue === value) return;

    this._view.dispatch({
      changes: { from: 0, to: currentValue.length, insert: value },
      selection:
        cursorOffset === undefined
          ? undefined
          : { anchor: cursorOffset, head: cursorOffset },
    });
  }

  private _setMergeValue(value: string) {
    if (!this._mergeView) {
      console.error(
        "Merge view is not initialized yet, but trying to show diff view",
      );
      return;
    }

    this._mergeView?.b.dispatch({
      changes: {
        from: 0,
        to: this._mergeView.b.state.doc.length,
        insert: value,
      },
    });
  }

  insertResource(
    resource: string,
    fromTo?: { from: number; to: number },
    nextCursorPosition?: { anchor: number; head: number },
  ) {
    if (!this._view) {
      console.error("Inserting resource but view is not initialized yet");
      return;
    }

    const { head, anchor } = this._view.state.selection.main;
    const from = fromTo?.from ?? Math.min(head, anchor);
    const to = fromTo?.to ?? Math.max(head, anchor);
    const newCursorOffset = from + resource.length;

    this._view.dispatch({
      changes: {
        from: from,
        to: to,
        insert: resource,
      },
      selection: nextCursorPosition ?? {
        anchor: newCursorOffset,
        head: newCursorOffset,
      },
    });
  }

  private _toggleDiff() {
    this._isShowingDiff = !this._isShowingDiff;
    const mergeViewUpperPanel =
      this._diff.querySelector<WonderUpperPanel>("wonder-upper-panel");

    if (!mergeViewUpperPanel) {
      console.error("Toggling diff but no merge view found");
      return;
    }

    mergeViewUpperPanel.isShowingDiff = this._isShowingDiff;

    this._setMergeValue(this.getValue());
  }

  private async _format() {
    if (!this._view) {
      console.error("Formatting but view is not initialized yet");
      return;
    }

    const cursorOffset = this._view.state.selection.main.head;

    const formattedValue = await formatSource(this.getValue(), cursorOffset);

    this.setValue(formattedValue.formatted, formattedValue.cursorOffset);
  }

  render() {
    return html`
      <div
        style="display: ${this._getDisplay()}; margin-top: ${this._getMarginTop()};}"
      >
        <link
          href="https://it-app-files.s3.amazonaws.com/static/home/scripts/codemirror/addons/merge.css"
          rel="stylesheet"
        />
        <div class="columns mb-1">
          <div
            id="editor"
            class="column"
            style="${this._isShowingDiff ? "display: none;" : ""}"
          ></div>
          <div
            id="diff"
            class="column"
            style="${this._isShowingDiff ? "" : "display: none;"}"
          ></div>
          <wonder-sidebar class="column is-one-third"></wonder-sidebar>
        </div>
      </div>
    `;
  }

  private _getDisplay() {
    if (this.shouldDisplay && wonderStore.currentPage !== Pages.Unknown)
      return "block";

    return "none";
  }

  private _getMarginTop() {
    if (wonderStore.currentPage === Pages.Edit) return "5px";

    return "0px";
  }
}
