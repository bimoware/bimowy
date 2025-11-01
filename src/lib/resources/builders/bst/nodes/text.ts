import { executeBST } from "../execute";
import type { BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTUITextNode = {
  _bsttype: BSTType.UISuperText;
  text: BSTNode;
  extra?: {
    latex?: boolean;
  };
};

export function executeText(node: BSTUITextNode, ctx: Scope) {
  return { ...node, extra: node.extra, text: executeBST(node.text, ctx) };
}
