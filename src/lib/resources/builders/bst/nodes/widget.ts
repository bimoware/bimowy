import type { WidgetId, WidgetProps } from "@/cpn/widgets";
import { executeBST } from "../execute";
import type { BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTUIWidgetNode<Id extends WidgetId = WidgetId> = {
  _bsttype: BSTType.UIWidget;
  id: Id;
  props: WidgetProps<Id>;
};

export function executeWidget(node: BSTUIWidgetNode, ctx: Scope) {
  return { ...node, props: executeBST(node.props, ctx) };
}
