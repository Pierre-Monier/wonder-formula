import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";

const settings = {
  background: "#fff",
  foreground: "#5c6166",
  caret: "#7c3aed",
  selection: "#036dd626",
  lineHighlight: "#8a91991a",
  gutterBackground: "#fff",
  gutterForeground: "#8a919966",
};

const styles = [
  {
    tag: t.variableName,
    color: "#121212",
    fontWeight: "bold",
  },
  {
    tag: t.string,
    color: "#261FED",
  },
  {
    tag: t.number,
    color: "#1F9BED",
    fontWeight: "bold",
  },
  {
    tag: t.bool,
    color: "#1F59ED",
    fontWeight: "bold",
  },
  {
    tag: t.keyword,
    color: "#ED991F",
    fontWeight: "bold",
  },
  {
    tag: t.operator,
    color: "#988A46",
    fontWeight: "bold",
  },
  {
    tag: t.function(t.variableName),
    color: "#261FED",
    fontWeight: "bold",
  },
  {
    tag: t.comment,
    color: "#8a919966",
  },
];

const mergeView = {
  deleteGutter: "#FF3860",
  deleteLine: "rgba(255,79,56,.25)",
  newGutter: "#23d160",
  newLine: "rgba(36,209,155,.25)",
};

const theme = EditorView.theme({
  "&": {
    backgroundColor: settings.background,
    color: settings.foreground,
  },
  ".cm-content": {
    caretColor: settings.caret,
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: settings.caret,
  },
  "&.cm-focused .cm-selectionBackgroundm .cm-selectionBackground, .cm-content ::selection":
    {
      backgroundColor: settings.selection,
    },
  ".cm-activeLine": {
    backgroundColor: settings.lineHighlight,
  },
  ".cm-gutters": {
    backgroundColor: settings.gutterBackground,
    color: settings.gutterForeground,
  },
  ".cm-activeLineGutter": {
    backgroundColor: settings.lineHighlight,
  },
  // mergeView
  "&.cm-merge-a .cm-changedLine, .cm-deletedChunk": {
    backgroundColor: mergeView.deleteLine,
  },
  "&.cm-merge-b .cm-changedLine": {
    backgroundColor: mergeView.newLine,
  },
  ".cm-changeGutter": { width: "3px", paddingLeft: "1px" },
  "&.cm-merge-a .cm-changedLineGutter, & .cm-deletedLineGutter": {
    background: mergeView.deleteGutter,
  },
  "&.cm-merge-b .cm-changedLineGutter": { background: mergeView.newGutter },
});

const highlightStyle = HighlightStyle.define(styles);
export const wonderTheme = [theme, syntaxHighlighting(highlightStyle)];

// export const wonderTheme = EditorView.theme({
//   "&": {
//     color: "white",
//     backgroundColor: "#034",
//   },
//   ".cm-content": {
//     caretColor: "#0e9",
//   },
//   "&.cm-focused .cm-cursor": {
//     borderLeftColor: "#0e9",
//   },
//   "&.cm-focused .cm-selectionBackground, ::selection": {
//     backgroundColor: "#074",
//   },
//   ".cm-gutters": {
//     backgroundColor: "#045",
//     color: "#ddd",
//     border: "none",
//   },
//   "&.cm-merge-a .cm-changedLine, .cm-deletedChunk": {
//     backgroundColor: "rgba(160, 128, 100, .08)",
//   },
//   "&.cm-merge-b .cm-changedLine": {
//     backgroundColor: "rgba(100, 160, 128, .08)",
//   },
//   ".cm-changeGutter": { width: "3px", paddingLeft: "1px" },
//   "&.cm-merge-a .cm-changedLineGutter, & .cm-deletedLineGutter": {
//     background: "#fa9",
//   },
//   "&.cm-merge-b .cm-changedLineGutter": { background: "#8f8" },
// });
