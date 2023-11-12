import data from "./data";
import { getSalesForceEditor } from "./get-editors";
import {
  insertSalesforceEditorButton,
  insertWonderFormulaButton,
} from "./insert-dom";

insertWonderFormulaButton(data.newFieldBaseSelector);
insertWonderFormulaButton(data.editFieldBaseSelector);

if (!data.baseSelector && getSalesForceEditor()) {
  insertSalesforceEditorButton(data.validationBaseSelector);
  insertWonderFormulaButton(data.validationBaseSelector);
}
