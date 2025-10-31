import { type BSTNode, BSTType } from "./nodes";
import type { BSTFunctionCallNode, FnID } from "./nodes/functionCall";
import type { BSTNumberInputNode } from "./nodes/number-input";
import type { BSTObjectNode } from "./nodes/object";
import type { BSTParagraphNode } from "./nodes/paragraph";
import type { BSTTextNode } from "./nodes/text";
import type { BSTVarGetNode } from "./nodes/varget";

export const $ = {
  concat: (args: BSTNode[], extra?: BSTTextNode["extra"]): BSTTextNode => ({
    _bsttype: BSTType.Text,
    extra,
    text: {
      _bsttype: BSTType.FunctionCall,
      args,
      id: "concat",
    },
  }),
  fn: <ID extends FnID>(id: ID, args: any): BSTFunctionCallNode =>
    ({
      _bsttype: BSTType.FunctionCall,
      args,
      id,
    }) as const,
  i: (arr: BSTNode, index: BSTNode): BSTFunctionCallNode =>
    $.fn("getIndex", [arr, index]),
  numinp: (id: string): BSTNumberInputNode => ({
    _bsttype: BSTType.NumberInput,
    id,
  }),
  obj: (obj: BSTObjectNode["value"]): BSTObjectNode => ({
    _bsttype: BSTType.Object,
    value: obj,
  }),
  prgh: (items: BSTNode[]): BSTParagraphNode => ({
    _bsttype: BSTType.Paragraph,
    items: items,
  }),
  text: (text: BSTNode): BSTTextNode => ({
    _bsttype: BSTType.Text,
    text,
  }),
  var: (id: BSTNode): BSTVarGetNode => ({
    _bsttype: BSTType.VarGet,
    id,
  }),
};
