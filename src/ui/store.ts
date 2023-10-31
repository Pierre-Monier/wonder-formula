import { FieldTreeNode } from "../shared/field-tree";
import Pages from "../shared/pages";
import { CheckSyntaxData } from "./type";

export const wonderStore = {
  checkSyntaxData: null as CheckSyntaxData | null,
  currentPage: Pages.Unknown,
  fieldTreeRoot: null as FieldTreeNode[] | null,
};
