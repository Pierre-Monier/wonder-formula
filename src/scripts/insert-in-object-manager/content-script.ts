// We need to insert wonder editor from a script so we have access to the
// WonderEditor complete API, loaded in the page.
const insertContentWithAnotherScript = () => {
  const indexSrc = chrome.runtime.getURL(
    "dist/scripts/insert-in-object-manager/index.min.js",
  );
  const indexScript = document.createElement("script");
  indexScript.setAttribute("src", indexSrc);

  const head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;
  head.insertBefore(indexScript, head.lastChild);
};

const insertWonderFormulaScript = (onload: () => void) => {
  const wonderEditorSrc = chrome.runtime.getURL("dist/ui/wonder-editor.min.js");
  const wonderEditorScript = document.createElement("script");
  wonderEditorScript.setAttribute("type", "module");
  wonderEditorScript.setAttribute("src", wonderEditorSrc);
  wonderEditorScript.onload = () => {
    onload();
  };

  const head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;
  head.insertBefore(wonderEditorScript, head.lastChild);
};

insertWonderFormulaScript(insertContentWithAnotherScript);
