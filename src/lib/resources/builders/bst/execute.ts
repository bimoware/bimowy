import { BSTType } from "./nodes";
import { executeFunctionCall } from "./nodes/functionCall";
import { executeIf } from "./nodes/if";
import { executeNumberInput } from "./nodes/number-input";
import { executeObject } from "./nodes/object";
import { executeParagraph } from "./nodes/paragraph";
import { executeText } from "./nodes/text";
import { executeVarGet } from "./nodes/varget";
import type { Scope } from "./scope";

export function executeBST(node: any, ctx: Scope): any {
  if (Array.isArray(node)) return node.map(n => executeBST(n, ctx))
  if (
    typeof node === "number" ||
    typeof node === "string" ||
    typeof node === "boolean" ||
    (typeof node === "object" && !("_bsttype" in node))
  )
    return node;
  switch (node._bsttype) {
    case BSTType.FunctionCall:
      return executeFunctionCall(node, ctx);
    case BSTType.If:
      return executeIf(node, ctx);
    case BSTType.Object:
      return executeObject(node, ctx);
    case BSTType.Paragraph:
      return executeParagraph(node, ctx);
    case BSTType.Text:
      return executeText(node, ctx);
    case BSTType.VarGet:
      return executeVarGet(node, ctx);
    case BSTType.NumberInput:
      return executeNumberInput(node);
    default:
      throw new Error(`Unknown BST node type: ${node._bsttype}`);
  }
}
