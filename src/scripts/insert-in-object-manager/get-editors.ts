import { Pages } from "../../shared/wonder-store";
import { WonderEditor } from "../../ui/editor";
import data from "./data";
import { getCurrentPage } from "./get-wonder-store-data";

export const getSalesForceEditor = () =>
  document.querySelector<HTMLTextAreaElement>(
    `${data.baseSelector} div.miniTabOn table > tbody > tr > td div > textarea`,
  );

export const getSalesforceEditorContainer = () => {
  const isOnValidationPage = getCurrentPage() === Pages.ValidationRules;

  return document.querySelector<HTMLElement>(
    `${data.baseSelector} ${isOnValidationPage ? "" : "div.miniTabOn"} table`,
  );
};

export const getWonderEditor = () =>
  document.querySelector<WonderEditor>(
    `${data.baseSelector} ${data.wonderEditorTag}`,
  );
