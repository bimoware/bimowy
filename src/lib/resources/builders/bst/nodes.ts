import type { BSTFunctionCallNode } from "./nodes/functionCall";
import type { BSTIfNode } from "./nodes/if";
import type { BSTNumberInputNode } from "./nodes/number-input";
import type { BSTObjectNode } from "./nodes/object";
import type { BSTParagraphNode } from "./nodes/paragraph";
import type { BSTTextNode } from "./nodes/text";
import type { BSTVarGetNode } from "./nodes/varget";

export enum BSTType {
  Object,
  If,
  FunctionCall,
  VarGet,
  Paragraph,
  NumberInput,
  Text,
}

export type BSTRawPrimitive = number | string | boolean;

export type BSTUINode =
  | BSTTextNode
  | BSTParagraphNode
  | BSTNumberInputNode
  | BSTRawPrimitive;

export type BSTNode =
  | BSTFunctionCallNode
  | BSTIfNode
  | BSTRawPrimitive
  | BSTObjectNode
  | BSTVarGetNode
  | BSTUINode
