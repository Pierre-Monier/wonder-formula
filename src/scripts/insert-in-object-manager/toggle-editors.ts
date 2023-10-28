import data from "./data";
import { getSalesforceEditorContainer, getWonderEditor } from "./get-editors";
import { syncEditors } from "./sync-editors";

export const toggleWonderFormulaEditor = (shouldDisplay: boolean) => {
  const wonderEditor = getWonderEditor();
  const salesForceEditorContainer = getSalesforceEditorContainer();

  if (!wonderEditor || !salesForceEditorContainer) return;

  syncEditors(shouldDisplay);

  wonderEditor.setAttribute(
    data.shouldDisplayAttribute,
    shouldDisplay ? "true" : "",
  );
  salesForceEditorContainer.style.display = shouldDisplay ? "none" : "block";
};
