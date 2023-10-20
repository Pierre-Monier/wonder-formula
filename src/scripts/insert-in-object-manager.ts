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

const insertWonderFormulaEditor = () => {
  const miniTabOn = document.querySelector(miniTabOnSelector);
  if (!miniTabOn) return;

  insertWonderFormulaScript(() => {
    const formulaEditor = document.createElement("wonder-editor");
    miniTabOn.insertAdjacentElement("afterbegin", formulaEditor);
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
    `${firstPWizardBodyDataCellSelector} wonder-editor`,
  );
  const salesForceEditor = document.querySelector<HTMLElement>(
    `${miniTabOnSelector} table`,
  );

  if (!wonderFormulaEditor || !salesForceEditor) return;

  wonderFormulaEditor.setAttribute(
    "should-display",
    shouldDisplay ? "true" : "",
  );
  salesForceEditor.style.display = shouldDisplay ? "none" : "block";
};

const insertWonderFormulaButton = () => {
  const ul = document.querySelector(`${firstPWizardBodyDataCellSelector} ul`);

  if (ul) {
    insertWonderFormulaEditor();

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
  }
};

const wonderFormulaLIId = "wonder-formula-button";
const firstPWizardBodyDataCellSelector = ".pbWizardBody table tbody > tr > td";
const miniTabOnSelector = `${firstPWizardBodyDataCellSelector} > div.miniTabOn`;

insertWonderFormulaButton();
