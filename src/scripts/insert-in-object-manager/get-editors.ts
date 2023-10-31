import { WonderEditor } from "../../ui/editor";
import data from "./data";

export const getSalesForceEditor = () =>
  document.querySelector<HTMLTextAreaElement>(
    `${data.baseSelector} div.miniTabOn table > tbody > tr > td div > textarea`,
  );

export const getSalesforceEditorContainer = () =>
  document.querySelector<HTMLElement>(
    `${data.baseSelector} div.miniTabOn table`,
  );

export const getWonderEditor = () =>
  document.querySelector<WonderEditor>(
    `${data.baseSelector} ${data.wonderEditorTag}`,
  );
