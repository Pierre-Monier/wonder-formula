import data from "./data";

export const syncEditors = (shouldDisplay: boolean) => {
  const wonderEditor = document.querySelector(
    `${data.baseSelector} ${data.wonderEditorTag}`,
  );
  const salesForceEditor = document.querySelector<HTMLTextAreaElement>(
    `${data.baseSelector} div.miniTabOn table > tbody > tr > td div > textarea`,
  );

  if (!wonderEditor || !salesForceEditor) return;

  const wonderEditorValue = wonderEditor.getAttribute("value");
  const salesforceEditorValue = salesForceEditor.value;
  if (shouldDisplay) {
    wonderEditor.setAttribute("value", salesforceEditorValue);
  } else if (wonderEditorValue) {
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
