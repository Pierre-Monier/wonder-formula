import data from "./data";
import { syncEditors } from "./sync-editors";

export const toggleWonderFormulaEditor = (shouldDisplay: boolean) => {
  const wonderEditor = document.querySelector<HTMLElement>(
    `${data.baseSelector} ${data.wonderEditorTag}`,
  );
  const salesForceEditorContainer = document.querySelector<HTMLElement>(
    `${data.baseSelector} div.miniTabOn table`,
  );

  if (!wonderEditor || !salesForceEditorContainer) return;

  syncEditors(shouldDisplay);

  wonderEditor.setAttribute(
    data.shouldDisplayAttribute,
    shouldDisplay ? "true" : "",
  );
  salesForceEditorContainer.style.display = shouldDisplay ? "none" : "block";
};
