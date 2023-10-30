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
