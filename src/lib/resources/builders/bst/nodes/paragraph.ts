import { executeBST } from "../execute";
import type { BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTParagraphNode = {
  _bsttype: BSTType.Paragraph;
  items: BSTNode[];
};

export function executeParagraph(node: BSTParagraphNode, ctx: Scope) {
  return { ...node, items: node.items.map((item) => executeBST(item, ctx)) };
}
