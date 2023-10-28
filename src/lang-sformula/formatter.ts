import { formatWithCursor } from "prettier/standalone";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";

export const formatSource = (source: string, cursorOffset?: number | null) =>
  formatWithCursor(source, {
    parser: "babel",
    tabWidth: 2,
    useTabs: false,
    cursorOffset: cursorOffset ?? 0,
    plugins: [estree, babel],
  });
