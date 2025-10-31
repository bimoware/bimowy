import type { BSTType } from "../nodes";

export type BSTNumberInputNode = {
  _bsttype: BSTType.NumberInput;
  id: string;
};

export const executeNumberInput = (node: BSTNumberInputNode) => {
  return { ...node };
};
