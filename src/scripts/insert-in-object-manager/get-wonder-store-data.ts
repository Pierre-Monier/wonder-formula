import { getSalesForceEditor } from "./get-editors";
import data from "./data";
import {
  FieldTreeController,
  Pages,
  WonderStore,
  OperatorTreeNode,
} from "../../shared/wonder-store";

const getCheckSyntaxData = () => {
  const input = document.querySelector<HTMLInputElement>(
    "input[name=validateDefaultFormula]",
  );
  const form = input?.form;

  const salesForceEditor = getSalesForceEditor();

  if (!input || !form || !salesForceEditor) return;

  return {
    url: form.action,
    getFormData: () => new FormData(form),
    valueKey: salesForceEditor.name,
    method: form.method,
  };
};

export const getCurrentPage = () => {
  switch (data.baseSelector) {
    case data.newFieldBaseSelector:
      return Pages.New;
    case data.editFieldBaseSelector:
      return Pages.Edit;
    default:
      return Pages.Unknown;
  }
};

const getFieldTreeRoot = () => {
  try {
    const salesforceFieldTreeController = eval(
      "fieldTreeController",
    ) as FieldTreeController;

    return salesforceFieldTreeController.tree.rootList;
  } catch (error) {
    console.error("Failed to get field tree");
    return undefined;
  }
};

const getOperators = () => {
  try {
    const menuDiv = eval(
      "new MenuButton('insertOperator', false).menuDiv",
    ) as HTMLDivElement;

    const operatorTreeRoot: OperatorTreeNode[] = [];
    for (const child of menuDiv.children) {
      console.log("child : ");
      const content = child.textContent?.split(" ");
      if (!content) continue;

      const [key, description] = content;

      if (!key) continue;

      operatorTreeRoot.push({ key, description });
    }

    return operatorTreeRoot;
  } catch (error) {
    console.error("Failed to get operators");
    return undefined;
  }
};

export const getWonderStoreData = (): WonderStore => ({
  checkSyntaxData: getCheckSyntaxData(),
  fieldTreeRoot: getFieldTreeRoot(),
  operatorTreeRoot: getOperators(),
  currentPage: getCurrentPage(),
});
