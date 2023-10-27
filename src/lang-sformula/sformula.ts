import { parser } from "./parser";
import { foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { LRLanguage } from "@codemirror/language";
import { completeFromList } from "@codemirror/autocomplete";
import { LanguageSupport } from "@codemirror/language";
import functions from "./function";

const parserWithMetadata = parser.configure({
  props: [
    styleTags({
      Identifier: t.variableName,
      Boolean: t.bool,
      String: t.string,
      Operator: t.operator,
      "( )": t.paren,
    }),
    indentNodeProp.add({
      Application: (context) =>
        context.column(context.node.from) + context.unit,
    }),
    foldNodeProp.add({
      Application: foldInside,
    }),
  ],
});

export const sformulaLanguage = LRLanguage.define({
  parser: parserWithMetadata,
});

export const sformulaCompletion = sformulaLanguage.data.of({
  autocomplete: completeFromList(
    functions.map((e) => ({ label: e, type: "function" })),
  ),
});

export const sformula = () =>
  new LanguageSupport(sformulaLanguage, [sformulaCompletion]);
