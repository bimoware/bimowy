import type { BSTType } from "../nodes";

export type BSTNUIumberInputNode = {
  _bsttype: BSTType.UINumberInput;
  id: string;
};

export const executeNumberInput = (node: BSTNUIumberInputNode) => {
  return { ...node };
};
