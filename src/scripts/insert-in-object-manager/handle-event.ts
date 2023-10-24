import Pages from "../../shared/pages";
import data from "./data";
import { getCurrentPage } from "./get-current-page";
import { syncEditorsBeforeSaved } from "./sync-editors";
import { toggleWonderFormulaEditor } from "./toggle-editors";

const onSalesforceButtonClick = (salesForceLI: Element, ul: Element) => {
  salesForceLI.addEventListener("click", () => {
    const currentTab = ul.querySelector(".currentTab");
    if (currentTab && currentTab !== salesForceLI) {
      currentTab.classList.remove("currentTab");
      currentTab.classList.add("tertiaryPalette");

      salesForceLI.classList.remove("tertiaryPalette");
      salesForceLI.classList.add("currentTab");

      if (currentTab.id === data.wonderFormulaLIId) {
        toggleWonderFormulaEditor(false);
      }
    }
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

export const handleEditorsTabs = (ul: Element) => {
  ul.querySelectorAll("li").forEach((salesForceLI) =>
    onSalesforceButtonClick(salesForceLI, ul),
  );

  const li = document.createElement("li");
  li.id = data.wonderFormulaLIId;
  li.classList.add("tertiaryPalette");

  const a = document.createElement("a");
  a.innerText = "Wonder Formula ✨";
  a.setAttribute("href", "javascript:void(0)");
  a.addEventListener("click", (event) => onButtonClick(event, li, ul));

  li.insertAdjacentElement("beforeend", a);

  ul.insertAdjacentElement("beforeend", li);

  return () => a.click();
};

const registerOnSaveNew = () => {
  const nextButtons = document.querySelectorAll(`input[name="goNext"].btn`);

  nextButtons.forEach((nextButton) => {
    nextButton.addEventListener("click", () => {
      syncEditorsBeforeSaved();
    });
  });
};

const registerOnSaveEdit = () => {
  const saveButtons = document.querySelectorAll(`input[name="save"].btn`);
  const quickSaveButtons = document.querySelectorAll(
    `input[name="quick_save"].btn`,
  );
  const buttons = [...saveButtons, ...quickSaveButtons];

  buttons.forEach((saveButton) => {
    saveButton.addEventListener("click", () => {
      syncEditorsBeforeSaved();
    });
  });
};

export const registerOnSaves = () => {
  const currentPage = getCurrentPage();

  switch (currentPage) {
    case Pages.New:
      registerOnSaveNew();
      break;
    case Pages.Edit:
      registerOnSaveEdit();
      break;
    default:
      break;
  }
};
