import { getSalesForceEditor } from "./get-editors";
import data from "./data";
import {
  FieldTreeController,
  Pages,
  WonderStore,
  OperatorTreeNode,
  FunctionsTreeNode,
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
    getFunctions();
    const menuDiv = eval(
      "new MenuButton('insertOperator', false).menuDiv",
    ) as HTMLDivElement;

    const operatorTreeRoot: OperatorTreeNode[] = [];
    for (const child of menuDiv.children) {
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

const getFunctions = () => {
  try {
    const calculatedFormulaFunctionTd = document.querySelector(
      "td#CalculatedFormula_functions",
    );

    if (!calculatedFormulaFunctionTd) {
      throw new Error("Failed to get calculatedFormulaFunctionTd");
    }

    const functionsScript = calculatedFormulaFunctionTd.querySelector("script");

    if (!functionsScript) {
      throw new Error("Failed to get functionsScript");
    }

    const getFunctionsScript =
      functionsScript.innerText +
      "const functionsResult = {functionNameToPrototypeMap, functionNameToDescriptionMap}; functionsResult;";
    const functionsResult = eval(getFunctionsScript) as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      functionNameToPrototypeMap: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      functionNameToDescriptionMap: any;
    };

    const functionTreeNodeRoot: FunctionsTreeNode[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.keys(functionsResult.functionNameToPrototypeMap).forEach((key) => {
      const descriptionData =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (functionsResult.functionNameToDescriptionMap[key] as string).split(
          "<br><br>",
        );

      const div = document.createElement("div");
      div.innerHTML = descriptionData[1] ?? "";
      const linkElement = div.querySelector<HTMLAnchorElement>("a");
      const onhelp = linkElement ? () => linkElement.click() : undefined;

      const node = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        key: functionsResult.functionNameToPrototypeMap[key] as string,
        name: key,
        description: descriptionData[0] ?? "",
        onhelp,
      };
      functionTreeNodeRoot.push(node);
    });

    return functionTreeNodeRoot;
  } catch (errors) {
    console.error("Failed to get functions : ", errors);
    return undefined;
  }
};

export const getWonderStoreData = (): WonderStore => ({
  checkSyntaxData: getCheckSyntaxData(),
  fieldTreeRoot: getFieldTreeRoot(),
  operatorTreeRoot: getOperators(),
  functionsTreeRoot: getFunctions(),
  currentPage: getCurrentPage(),
});