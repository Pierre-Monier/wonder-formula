export enum ValidationState {
  Loading,
  Valid,
  Invalid,
}

export type EditorResource = {
  name: string;
  key: string;
  onclick: () => void;
  onhelp?: () => void;
  children?: EditorResource[];
  descriptions?: string[];
};
