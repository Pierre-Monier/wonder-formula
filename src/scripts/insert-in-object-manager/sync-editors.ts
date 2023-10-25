import { WonderEditor } from "../../ui/wonder-editor";
import data from "./data";

export const syncEditors = (shouldDisplay: boolean) => {
  const wonderEditor = document.querySelector<WonderEditor>(
    `${data.baseSelector} ${data.wonderEditorTag}`,
  );
  const salesForceEditor = document.querySelector<HTMLTextAreaElement>(
    `${data.baseSelector} div.miniTabOn table > tbody > tr > td div > textarea`,
  );

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
