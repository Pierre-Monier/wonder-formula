export type CheckSyntaxData = {
  url: string;
  method: string;
  getFormData: () => FormData;
  valueKey: string;
};

export type FieldTreeNode = {
  children: FieldTreeNode[];
  isLeaf: boolean;
  key: string;
  labelName: string;
  attributes?: FieldTreeNodeAttribute;
  parent?: FieldTreeNode;
};

export type OperatorTreeNode = {
  key: string;
  description?: string;
};

type FieldTreeNodeAttribute = {
  type?: string;
};

export type FieldTreeController = {
  tree: {
    rootList: FieldTreeNode[];
  };
};

export type WonderStore = {
  checkSyntaxData?: CheckSyntaxData;
  currentPage: Pages;
  fieldTreeRoot?: FieldTreeNode[];
  operatorTreeRoot?: OperatorTreeNode[];
};

export enum Pages {
  New = "new",
  Edit = "edit",
  Unknown = "unknown",
}
