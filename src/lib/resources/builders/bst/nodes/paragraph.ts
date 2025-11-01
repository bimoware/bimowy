import { executeBST } from "../execute";
import type { BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTUIParagraphNode = {
  _bsttype: BSTType.UIParagraph;
  items: BSTNode[];
};

export function executeParagraph(node: BSTUIParagraphNode, ctx: Scope) {
  return { ...node, items: node.items.map((item) => executeBST(item, ctx)) };
}
