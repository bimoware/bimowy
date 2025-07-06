import { Ranges } from "..";
import { marginOffset, stepBreakpoints } from "./const";


export function getXDiff(ranges: Ranges) {
	return ranges.x[1] - ranges.x[0];
}
export function getYDiff(ranges: Ranges) {
	return ranges.y[1] - ranges.y[0];
}
export function getViewBox(ranges: Ranges) {
	return [
		0, 0,
		getXDiff(ranges) + marginOffset * 2,
		getYDiff(ranges) + marginOffset * 2
	];
}
export function getXCoor(ranges: Ranges, x: number) {
	return marginOffset - ranges.x[0] + x;
}
export function getYCoor(ranges: Ranges, y: number) {
	return marginOffset + ranges.y[1] - y;
}

export function getBreakPoint(ranges: Ranges) {
	const diff = Math.max(getXDiff(ranges), getYDiff(ranges));
	let step = 1;
	for (const bp in stepBreakpoints) {
		const numBp = Number(bp);
		if (diff > numBp) {
			step = stepBreakpoints[numBp as keyof typeof stepBreakpoints];
		}
	}
	return step;
}
