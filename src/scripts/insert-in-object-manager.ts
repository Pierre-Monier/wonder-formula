import Pages from "../shared/pages";
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

const insertWonderFormulaEditor = (
  navigateToWonderEditor: (() => void) | null,
) => {
  const miniTabOn = document.querySelector(`${baseSelector} div.miniTabOn`);
  if (!miniTabOn) return;

  insertWonderFormulaScript(() => {
    const formulaEditor = document.createElement(wonderEditorTag);
    formulaEditor.setAttribute("page", getCurrentPage());
    miniTabOn.insertAdjacentElement("afterbegin", formulaEditor);
    navigateToWonderEditor?.();
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
  const wonderFormulaEditor = document.querySelector<HTMLElement>(
    `${baseSelector} ${wonderEditorTag}`,
  );
  const salesForceEditorContainer = document.querySelector<HTMLElement>(
    `${baseSelector} div.miniTabOn table`,
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
  const wonderFormulaEditor = document.querySelector<WonderEditor>(
    `${baseSelector} ${wonderEditorTag}`,
  );
  const salesForceEditor = document.querySelector<HTMLTextAreaElement>(
    `${baseSelector} div.miniTabOn table > tbody > tr > td div > textarea`,
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

// Used to do a better redirection when the user switches tabs
const rememberCurrentLink = (ul: Element) => {
  const latestCurrentLink = localStorage.getItem(currentLinkKey);

  const currentLink = ul.querySelector(".currentTab a")?.getAttribute("title");

  localStorage.setItem(currentLinkKey, currentLink || "");

  return !latestCurrentLink || latestCurrentLink === currentLink;
};

const insertWonderFormulaButton = (givenBaseSelector: string) => {
  const ul = document.querySelector(`${givenBaseSelector} ul`);

  if (ul) {
    baseSelector = givenBaseSelector;

    const shouldNavigateToWonderEditor = rememberCurrentLink(ul);

    const navigateToWonderEditor = handleEditorsTabs(ul);
    insertWonderFormulaEditor(
      shouldNavigateToWonderEditor ? navigateToWonderEditor : null,
    );
  }
};

const newFieldBaseSelector = ".pbWizardBody table tbody > tr > td";
const editFieldBaseSelector =
  "div.pbBody div.pbSubsection table > tbody div.formulaEditorOuter > table > tbody";
let baseSelector = "";

const getCurrentPage = () => {
  switch (baseSelector) {
    case newFieldBaseSelector:
      return Pages.New;
    case editFieldBaseSelector:
      return Pages.Edit;
    default:
      return Pages.Unknown;
  }
};

const wonderFormulaLIId = "wonder-formula-button";
const wonderEditorTag = `wonder-editor`;

const currentLinkKey = "currentLink";

void insertWonderFormulaButton(newFieldBaseSelector);
void insertWonderFormulaButton(editFieldBaseSelector);
