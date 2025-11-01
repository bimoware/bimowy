import { executeBST } from "../../execute";
import type { BSTNode, BSTType } from "../../nodes";
import type { Scope } from "../../scope";
import { ALL_FUNCTIONS } from "./list";

export type FnRegistry = typeof ALL_FUNCTIONS;
export type FnID = keyof FnRegistry;
export type Fn<ID extends FnID> = FnRegistry[ID];
export type RawArgs<ID extends FnID> = Parameters<Fn<ID>>;
export type ReturnFn<ID extends FnID> = ReturnType<Fn<ID>>;
export type Args<ID extends FnID> = Array<RawArgs<ID>[number] | BSTNode>;

export type BSTCodeFunctionCallNode<ID extends FnID = FnID> = {
  _bsttype: BSTType.CodeFunctionCall;
  id: ID;
  args: Args<ID>;
};

export function executeFunctionCall<ID extends FnID>(
  node: BSTCodeFunctionCallNode<ID>,
  ctx: Scope,
): ReturnType<Fn<ID>> {
  const fn = ALL_FUNCTIONS[node.id] as Fn<ID>;
  const args = executeBST(node.args, ctx);
  // @ts-expect-error
  return fn(...args);
}
