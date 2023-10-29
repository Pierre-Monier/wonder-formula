export type FieldTreeNode = {
  children: FieldTreeNode[];
  isLeaf: boolean;
  key: string;
  labelName: string;
};

export type FieldTreeController = {
  tree: {
    rootList: FieldTreeNode[];
  };
};
