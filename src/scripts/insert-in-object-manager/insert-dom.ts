import { WonderEditor } from "../../ui/wonder-editor";
import data from "./data";
import { getCheckSyntaxData } from "./get-check-syntax-data";
import { getCurrentPage } from "./get-current-page";
import { handleEditorsTabs, registerOnSaves } from "./handle-event";
import { rememberCurrentLink } from "./remember-link";

const insertWonderFormulaEditor = (
  navigateToWonderEditor: (() => void) | null,
) => {
  const miniTabOn = document.querySelector(
    `${data.baseSelector} div.miniTabOn`,
  );
  if (!miniTabOn) return;

  const formulaEditor = document.createElement(
    data.wonderEditorTag,
  ) as WonderEditor;
  formulaEditor.setAttribute("page", getCurrentPage());
  miniTabOn.insertAdjacentElement("afterbegin", formulaEditor);
  navigateToWonderEditor?.();

  const checkSyntaxData = getCheckSyntaxData();
  if (!checkSyntaxData) return;

  formulaEditor.setCheckSyntaxData(checkSyntaxData);
};

export const insertWonderFormulaButton = (givenBaseSelector: string) => {
  const ul = document.querySelector(`${givenBaseSelector} ul`);

  if (ul) {
    data.baseSelector = givenBaseSelector;
    const shouldNavigateToWonderEditor = rememberCurrentLink(ul);

    const navigateToWonderEditor = handleEditorsTabs(ul);
    insertWonderFormulaEditor(
      shouldNavigateToWonderEditor ? navigateToWonderEditor : null,
    );

    registerOnSaves();
  }
};

// We need to insert wonder editor from a script so we have access to the
// WonderEditor complete API, loaded in the page.
export const insertInObjectManager = () => {
  const indexSrc = chrome.runtime.getURL(
    `dist/scripts/insert-in-object-manager/index.min.js`,
  );
  const indexScript = document.createElement("script");
  indexScript.setAttribute("src", indexSrc);

  const head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;
  head.insertBefore(indexScript, head.lastChild);
};

export const insertWonderEditorSrc = (onload: () => void) => {
  const wonderEditorSrc = chrome.runtime.getURL("dist/ui/wonder-editor.min.js");
  const wonderEditorScript = document.createElement("script");
  wonderEditorScript.setAttribute("type", "module");
  wonderEditorScript.setAttribute("src", wonderEditorSrc);
  wonderEditorScript.onload = () => {
    onload();
  };

  const head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;
  head.insertBefore(wonderEditorScript, head.lastChild);
};
