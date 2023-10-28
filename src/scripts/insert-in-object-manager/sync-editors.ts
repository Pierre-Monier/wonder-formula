import data from "./data";
import { getSalesForceEditor, getWonderEditor } from "./get-editors";

export const syncEditors = (shouldDisplay: boolean) => {
  const wonderEditor = getWonderEditor();
  const salesForceEditor = getSalesForceEditor();

  if (!wonderEditor || !salesForceEditor) return;

  const wonderEditorValue = wonderEditor.getValue();
  const salesforceEditorValue = salesForceEditor.value;

  if (shouldDisplay) {
    wonderEditor.setValue(salesforceEditorValue);
  } else {
    salesForceEditor.value = wonderEditorValue;
  }
};

export const syncEditorsBeforeSaved = () => {
  const wonderEditor = document.querySelector(
    `${data.baseSelector} ${data.wonderEditorTag}`,
  );

  const isWonderEditorUsed = wonderEditor?.getAttribute(
    data.shouldDisplayAttribute,
  );
  if (!isWonderEditorUsed) return;

  syncEditors(false);
};
