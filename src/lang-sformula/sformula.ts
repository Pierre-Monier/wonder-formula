import { parser } from "./parser";
import { foldNodeProp, indentNodeProp } from "@codemirror/language";
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
      Function: t.function(t.variableName),
    }),
    indentNodeProp.add({
      Function: (context) => context.column(context.node.from) + context.unit,
    }),
    foldNodeProp.add({
      Function: (node) => ({ from: node.from + 1, to: node.to - 1 }),
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
