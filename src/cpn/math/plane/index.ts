import { SVGAttributes } from "react";

export const defaultStrokeProps: SVGAttributes<SVGElement> = {
	strokeLinejoin: "round",
	strokeLinecap: "round"
};
export const defaultTextProps: SVGAttributes<SVGTextElement> = {
	fill: "white"
}
export const randomColors = [
	"#a855f7",
	"#ef4444",
	"#0ea5e9",
	"#22c55e",
	"#f59e0b",
	"#6366f1"
]
export const strokeWidth = {
	min: 0.1,
	normal: 0.2
}
export const marginOffset = 0.8;
export const opacity = {
	bg: 1 / 10,
	side: 5 / 10,
	mainHidden: 6 / 10,
	main: 9 / 10
}
const stepBreakpoints = {
	11: 5,
	30: 10,
	45: 15,
	60: 20
} as const

export enum ElemType {
	Point = "point",
	Vector = "vector",
	ScalarFunction = "scalar-function",
	VectorFunction = "vector-function",
	Circle = "circle"
}
export type Ranges = { x: Range; y: Range; };
export type Range = [number, number];
export type Excluded = "bg" | "x-axis" | "x-labels" | "y-axis" | "y-labels"
export type DefaultElemProps = { id: string, color?: typeof randomColors[number] }
export type VectorProps = DefaultElemProps & {
	type: ElemType.Vector;
	x1: number; y1: number; x2: number; y2: number;
};
export type PointProps = DefaultElemProps & {
	type: ElemType.Point;
	x: number;
	y: number;
};
export type ScalarFunctionProps = DefaultElemProps & {
	type: ElemType.ScalarFunction,
	f: (x: number) => number
}
export type VectorFunctionProps = DefaultElemProps & {
	type: ElemType.VectorFunction
	f: (t: number) => [x: number, y: number],
	interval: [number, number]
}
export type CircleProps = DefaultElemProps & {
	type: ElemType.Circle,
	x: number,
	y: number,
	r: number
}
export type ElemProps = VectorProps | PointProps | ScalarFunctionProps | CircleProps | VectorFunctionProps;
export type PlaneProps = {
	ranges: Ranges;
	elems?: ElemProps[];
	excluded?: Excluded[]
};

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
export type AxisOption = "x" | "y";
