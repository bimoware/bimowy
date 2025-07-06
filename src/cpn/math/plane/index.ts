import { presetColors } from "./extra/const";

export * from "./extra/const"
export * from "./extra/util"

export type Ranges = { x: Range; y: Range; };
export type Range = [number, number];
export type AxisOption = "x" | "y";

export type Excludables = "bg" | "x-axis" | "x-labels" | "y-axis" | "y-labels"

export type DefaultPlaneElementProps = { color?: typeof presetColors[number] }
export enum PlaneElementEnum {
	Point = "point",
	Vector = "vector",
	ScalarFunction = "scalar-function",
	VectorFunction = "vector-function",
	Circle = "circle"
}

type PositionExtra = { x: number, y: number }
type IntervalExtra = { interval: Range }

export type CustomPlaneElementConfigByType = {
	[PlaneElementEnum.Point]: PositionExtra
	[PlaneElementEnum.Circle]: PositionExtra & { r: number }
	[PlaneElementEnum.Vector]: { x1: number, y1: number, x2: number, y2: number }
	[PlaneElementEnum.ScalarFunction]: IntervalExtra & { f: (x: number) => number }
	[PlaneElementEnum.VectorFunction]: IntervalExtra & { f: (t: number) => [number, number] }
}
export type PlaneElementData<T extends PlaneElementEnum> = { type: T } & DefaultPlaneElementProps & CustomPlaneElementConfigByType[T]
export type PlaneElementProps<T extends PlaneElementEnum> = Omit<PlaneElementData<T>, "type"> & Omit<PlaneProps, "excluded">

export type AnyPlaneElementData = {
	[K in PlaneElementEnum]: PlaneElementData<K>
}[PlaneElementEnum]


export type PartialPlaneProps = {
	ranges: Ranges;
	elems?: Record<string, AnyPlaneElementData>;
	excluded?: Excludables[]
};
export type PlaneProps = Required<PartialPlaneProps>