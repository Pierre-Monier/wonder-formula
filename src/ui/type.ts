export type CheckSyntaxData = {
  url: string;
  method: string;
  getFormData: () => FormData;
  valueKey: string;
};

export enum ValidationState {
  Loading,
  Valid,
  Invalid,
}

export type EditorResource = {
  name: string;
  key: string;
  onclick: () => void;
  children?: EditorResource[];
  descriptions?: string[];
};
