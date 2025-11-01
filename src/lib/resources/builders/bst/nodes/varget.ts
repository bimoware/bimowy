import type { BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTCodeVarGetNode = {
  _bsttype: BSTType.CodeVarGet;
  id: BSTNode;
};

export function executeVarGet(node: BSTCodeVarGetNode, ctx: Scope) {
  return ctx.getVariable(node.id as string);
}
