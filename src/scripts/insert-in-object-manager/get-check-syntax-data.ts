import { getSalesForceEditor } from "./get-editors";

export const getCheckSyntaxData = () => {
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
