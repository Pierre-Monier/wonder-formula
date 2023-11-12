import data from "./insert-in-object-manager/data";
import {
  insertInObjectManager,
  insertWonderEditorSrc,
} from "./insert-in-object-manager/insert-dom";

const checkPageToInsert = (giventSelector: string) => {
  const ul = document.querySelector(giventSelector);

  return ul !== null;
};

const shouldInsertObjectManagerScript =
  checkPageToInsert(data.newFieldBaseSelector + " ul") ||
  checkPageToInsert(data.editFieldBaseSelector + " ul") ||
  checkPageToInsert(data.validationBaseSelector);

if (shouldInsertObjectManagerScript) {
  insertWonderEditorSrc(() => insertInObjectManager());
}
