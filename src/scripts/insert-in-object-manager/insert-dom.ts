import data from "./data";
import { getCurrentPage } from "./get-current-page";
import { handleEditorsTabs, registerOnSaves } from "./handle-event";
import { rememberCurrentLink } from "./remember-link";

const insertWonderFormulaScript = (onload: () => void) => {
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

const insertWonderFormulaEditor = (
  navigateToWonderEditor: (() => void) | null,
) => {
  const miniTabOn = document.querySelector(
    `${data.baseSelector} div.miniTabOn`,
  );
  if (!miniTabOn) return;

  insertWonderFormulaScript(() => {
    const formulaEditor = document.createElement(data.wonderEditorTag);
    formulaEditor.setAttribute("page", getCurrentPage());
    miniTabOn.insertAdjacentElement("afterbegin", formulaEditor);
    navigateToWonderEditor?.();
  });
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
