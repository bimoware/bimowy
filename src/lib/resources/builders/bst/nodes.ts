import type { BSTCodeFunctionCallNode } from "./nodes/functionCall";
import type { BSTCodeIfNode } from "./nodes/if";
import type { BSTNUIumberInputNode } from "./nodes/number-input";
import type { BSTCodeObjectNode } from "./nodes/object";
import type { BSTUIParagraphNode } from "./nodes/paragraph";
import type { BSTUITextNode } from "./nodes/text";
import type { BSTCodeVarGetNode } from "./nodes/varget";

export enum BSTType {
  CodeObject,
  CodeIf,
  CodeFunctionCall,
  CodeVarGet,
  UIParagraph,
  UINumberInput,
  UISuperText,
  TypeNumber
}

export type BSTRawPrimitive = number | string | boolean;

export type BSTUINode =
  | BSTUITextNode
  | BSTUIParagraphNode
  | BSTNUIumberInputNode
  | BSTRawPrimitive;

export type BSTNode =
  | BSTCodeFunctionCallNode
  | BSTCodeIfNode
  | BSTRawPrimitive
  | BSTCodeObjectNode
  | BSTCodeVarGetNode
  | BSTUINode
