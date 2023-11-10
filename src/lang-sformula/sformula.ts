import { parser } from "./parser";
import {
  continuedIndent,
  foldNodeProp,
  indentNodeProp,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { LRLanguage } from "@codemirror/language";
import { LanguageSupport } from "@codemirror/language";

const parserWithMetadata = parser.configure({
  props: [
    styleTags({
      Identifier: t.variableName,
      Boolean: t.bool,
      String: t.string,
      Operator: t.operator,
      "( )": t.paren,
      Function: t.function(t.variableName),
      Keyword: t.keyword,
      Number: t.number,
      Comment: t.comment,
      CommentEnd: t.comment,
    }),
    indentNodeProp.add({
      Function: continuedIndent(),
    }),
    foldNodeProp.add({
      Function: (node) => ({ from: node.from + 1, to: node.to - 1 }),
    }),
  ],
});

const sformulaLanguage = LRLanguage.define({
  parser: parserWithMetadata,
});

export const sformula = () => new LanguageSupport(sformulaLanguage);
