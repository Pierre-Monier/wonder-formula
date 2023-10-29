import { FieldTreeController } from "../../shared/field-tree";

export const getFieldTreeRoot = () => {
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
