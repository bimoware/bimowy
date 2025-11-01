import { executeBST } from "../execute";
import type { BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTCodeObjectNode = {
  _bsttype: BSTType.CodeObject;
  value: Record<string, BSTNode>;
};

export function executeObject(node: BSTCodeObjectNode, ctx: Scope): any {
  const newObj: Record<string, any> = {};
  for (const [key, element] of Object.entries(node.value)) {
    newObj[key] = executeBST(element, ctx);
  }
  return newObj;
}
