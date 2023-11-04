import { formatWithCursor } from "prettier/standalone";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";

export const formatSource = async (
  source: string,
  cursorOffset?: number | null,
) => {
  const formattedFormula = await formatWithCursor(source, {
    parser: "babel",
    tabWidth: 2,
    useTabs: false,
    cursorOffset: cursorOffset ?? 0,
    plugins: [estree, babel],
    semi: false,
  });

  const lastCharacterPosition = formattedFormula.formatted.length - 1;

  // We have to do this by hand because prettier doesn't remove the last line break
  // https://github.com/prettier/prettier/issues/6360
  if (formattedFormula.formatted.charAt(lastCharacterPosition) === "\n") {
    formattedFormula.formatted = formattedFormula.formatted.slice(
      0,
      lastCharacterPosition,
    );
  }

  return formattedFormula;
};
