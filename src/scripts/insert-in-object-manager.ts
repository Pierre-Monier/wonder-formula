import { WonderEditor } from "../ui/wonder-editor";

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

const insertWonderFormulaEditor = (navigateToWonderEditor: () => void) => {
  const miniTabOn = document.querySelector(miniTabOnSelector);
  if (!miniTabOn) return;

  insertWonderFormulaScript(() => {
    const formulaEditor = document.createElement(wonderEditorTag);
    miniTabOn.insertAdjacentElement("afterbegin", formulaEditor);
    navigateToWonderEditor();
  });
};

const onButtonClick = (
  event: MouseEvent,
  wonderFormulaLI: Element,
  ul: Element,
) => {
  const isCurrentlySelected = wonderFormulaLI.classList.contains("currentTab");
  if (!isCurrentlySelected) {
    const currentTab = ul.querySelector(".currentTab");
    if (currentTab) {
      currentTab.classList.remove("currentTab");
      currentTab.classList.add("tertiaryPalette");
    }

    wonderFormulaLI.classList.remove("tertiaryPalette");
    wonderFormulaLI.classList.add("currentTab");

    toggleWonderFormulaEditor(true);
  }

  event.preventDefault();
};

const onSalesforceButtonClick = (salesForceLI: Element, ul: Element) => {
  salesForceLI.addEventListener("click", () => {
    const currentTab = ul.querySelector(".currentTab");
    if (currentTab && currentTab !== salesForceLI) {
      currentTab.classList.remove("currentTab");
      currentTab.classList.add("tertiaryPalette");

      salesForceLI.classList.remove("tertiaryPalette");
      salesForceLI.classList.add("currentTab");

      if (currentTab.id === wonderFormulaLIId) {
        toggleWonderFormulaEditor(false);
      }
    }
  });
};

const toggleWonderFormulaEditor = (shouldDisplay: boolean) => {
  const wonderFormulaEditor =
    document.querySelector<HTMLElement>(wonderEditorSelector);
  const salesForceEditorContainer = document.querySelector<HTMLElement>(
    `${miniTabOnSelector} table`,
  );

  if (!wonderFormulaEditor || !salesForceEditorContainer) return;

  syncEditors(shouldDisplay);

  wonderFormulaEditor.setAttribute(
    "should-display",
    shouldDisplay ? "true" : "",
  );
  salesForceEditorContainer.style.display = shouldDisplay ? "none" : "block";
};

const handleEditorsTabs = (ul: Element) => {
  ul.querySelectorAll("li").forEach((salesForceLI) =>
    onSalesforceButtonClick(salesForceLI, ul),
  );

  const li = document.createElement("li");
  li.id = wonderFormulaLIId;
  li.classList.add("tertiaryPalette");

  const a = document.createElement("a");
  a.innerText = "Wonder Formula ✨";
  a.setAttribute("href", "javascript:void(0)");
  a.addEventListener("click", (event) => onButtonClick(event, li, ul));

  li.insertAdjacentElement("beforeend", a);

  ul.insertAdjacentElement("beforeend", li);

  return () => a.click();
};

const syncEditors = (shouldDisplay: boolean) => {
  const wonderFormulaEditor =
    document.querySelector<WonderEditor>(wonderEditorSelector);
  const salesForceEditor = document.querySelector<HTMLTextAreaElement>(
    `${miniTabOnSelector} table > tbody > tr > td div > textarea`,
  );

  if (!wonderFormulaEditor || !salesForceEditor) return;

  const wonderEditorValue = wonderFormulaEditor.getAttribute("value");
  const salesforceEditorValue = salesForceEditor.value;
  if (shouldDisplay) {
    wonderFormulaEditor.setAttribute("value", salesforceEditorValue);
  } else if (wonderEditorValue) {
    salesForceEditor.value = wonderEditorValue;
  }
};

const insertWonderFormulaButton = () => {
  const ul = document.querySelector(`${firstPWizardBodyDataCellSelector} ul`);

  if (ul) {
    const navigateToWonderEditor = handleEditorsTabs(ul);
    insertWonderFormulaEditor(navigateToWonderEditor);
  }
};

const wonderFormulaLIId = "wonder-formula-button";
const firstPWizardBodyDataCellSelector = ".pbWizardBody table tbody > tr > td";
const miniTabOnSelector = `${firstPWizardBodyDataCellSelector} > div.miniTabOn`;
const wonderEditorTag = `wonder-editor`;
const wonderEditorSelector = `${firstPWizardBodyDataCellSelector} ${wonderEditorTag}`;

insertWonderFormulaButton();
