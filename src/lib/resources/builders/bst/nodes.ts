import type { BSTCodeFunctionCallNode } from "./nodes/functionCall";
import type { BSTCodeIfNode } from "./nodes/if";
import type { BSTNUIumberInputNode } from "./nodes/number-input";
import type { BSTCodeObjectNode } from "./nodes/object";
import type { BSTUIParagraphNode } from "./nodes/paragraph";
import type { BSTUITextNode } from "./nodes/text";
import type { BSTCodeVarGetNode } from "./nodes/varget";
import type { BSTUIWidgetNode } from "./nodes/widget";

export enum BSTType {
  CodeObject,
  CodeIf,
  CodeFunctionCall,
  CodeVarGet,
  UIWidget,
  UIParagraph,
  UINumberInput,
  UISuperText,
  TypeNumber,
}

export type BSTRawPrimitive = number | string | boolean;

export type BSTUINode =
  | BSTUITextNode
  | BSTUIParagraphNode
  | BSTNUIumberInputNode
  | BSTRawPrimitive
  | BSTUIWidgetNode;

export type BSTNode =
  | BSTCodeFunctionCallNode
  | BSTCodeIfNode
  | BSTRawPrimitive
  | BSTCodeObjectNode
  | BSTCodeVarGetNode
  | BSTUINode;
