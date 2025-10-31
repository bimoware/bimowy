import { executeBST } from "../execute";
import type { BSTNode, BSTRawPrimitive, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTIfNode = {
  _bsttype: BSTType.If;
  condition: BSTNode;
  success: BSTNode;
  fail: BSTNode;
};

export function executeIf(node: BSTIfNode, ctx: Scope): BSTRawPrimitive {
  return executeBST(node.condition, ctx)
    ? executeBST(node.success, ctx)
    : executeBST(node.fail, ctx);
}
