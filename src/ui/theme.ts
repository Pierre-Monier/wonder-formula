import { EditorView } from "@codemirror/view";

export const wonderTheme = EditorView.theme(
  {
    "&": {
      color: "white",
      backgroundColor: "#034",
    },
    ".cm-content": {
      caretColor: "#0e9",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#0e9",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#074",
    },
    ".cm-gutters": {
      backgroundColor: "#045",
      color: "#ddd",
      border: "none",
    },
    "&.cm-merge-a .cm-changedLine, .cm-deletedChunk": {
      backgroundColor: "rgba(160, 128, 100, .08)",
    },
    "&.cm-merge-b .cm-changedLine": {
      backgroundColor: "rgba(100, 160, 128, .08)",
    },
    ".cm-changeGutter": { width: "3px", paddingLeft: "1px" },
    "&.cm-merge-a .cm-changedLineGutter, & .cm-deletedLineGutter": {
      background: "#fa9",
    },
    "&.cm-merge-b .cm-changedLineGutter": { background: "#8f8" },
  },
  { dark: true },
);
