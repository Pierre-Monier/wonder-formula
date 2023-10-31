import {
  CheckSyntaxData,
  FieldTreeNode,
  OperatorTreeNode,
  Pages,
  WonderStore,
} from "../shared/wonder-store";

export const wonderStore: WonderStore = {
  checkSyntaxData: undefined as CheckSyntaxData | undefined,
  currentPage: Pages.Unknown,
  fieldTreeRoot: undefined as FieldTreeNode[] | undefined,
  operatorTreeRoot: undefined as OperatorTreeNode[] | undefined,
};
