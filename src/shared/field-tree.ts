export type FieldTreeNode = {
  children: FieldTreeNode[];
  isLeaf: boolean;
  key: string;
  labelName: string;
  attributes?: FieldTreeNodeAttribute;
  parent?: FieldTreeNode;
};

type FieldTreeNodeAttribute = {
  type?: string;
};

export type FieldTreeController = {
  tree: {
    rootList: FieldTreeNode[];
  };
};
