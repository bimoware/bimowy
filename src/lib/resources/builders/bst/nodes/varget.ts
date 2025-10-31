import type { BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTVarGetNode = {
  _bsttype: BSTType.VarGet;
  id: BSTNode;
};

export function executeVarGet(node: BSTVarGetNode, ctx: Scope) {
  return ctx.getVariable(node.id as string);
}
