import type { BSTType } from "../nodes";

export type BSTOptionInterval = {
  _bsttype: BSTType.OptionInterval;
  name: string;
  min?: number;
  max?: number;
  defaultValue: [number, number];
};
