import Pages from "../../shared/pages";
import data from "./data";

export const getCurrentPage = () => {
  switch (data.baseSelector) {
    case data.newFieldBaseSelector:
      return Pages.New;
    case data.editFieldBaseSelector:
      return Pages.Edit;
    default:
      return Pages.Unknown;
  }
};
