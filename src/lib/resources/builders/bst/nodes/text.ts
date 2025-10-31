import { executeBST } from "../execute";
import type { BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTTextNode = {
  _bsttype: BSTType.Text;
  text: BSTNode;
  extra?: {
    latex?: boolean;
  };
};

export function executeText(node: BSTTextNode, ctx: Scope) {
  return { ...node, extra: node.extra, text: executeBST(node.text, ctx) };
}
