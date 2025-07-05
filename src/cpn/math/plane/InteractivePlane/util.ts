import { Ranges } from "..";

export const rangeInputs: Record<
	"x" | "y",
	((prev: Ranges, newValue: number) => Ranges)[]
> = {
	'x': [
		(prev: Ranges, newValue: number) => ({ ...prev, x: [newValue, prev.x[1]] }),
		(prev: Ranges, newValue: number) => ({ ...prev, x: [prev.x[0], newValue] })
	],
	'y': [
		(prev: Ranges, newValue: number) => ({ ...prev, y: [newValue, prev.y[1]] }),
		(prev: Ranges, newValue: number) => ({ ...prev, y: [prev.y[0], newValue] })
	]
} as const

export function numberToLetter(n: number) {
	return String.fromCharCode(63 + n);
}