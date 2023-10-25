import data from "./insert-in-object-manager/data";
import {
  insertInObjectManager,
  insertWonderEditorSrc,
} from "./insert-in-object-manager/insert-dom";

const checkPageToInsert = (givenBaseSelector: string) => {
  const ul = document.querySelector(`${givenBaseSelector} ul`);

  return ul !== null;
};

const shouldInsertObjectManagerScript =
  checkPageToInsert(data.newFieldBaseSelector) ||
  checkPageToInsert(data.editFieldBaseSelector);

if (shouldInsertObjectManagerScript) {
  insertWonderEditorSrc(() => insertInObjectManager());
}
