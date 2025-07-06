import { SVGAttributes } from "react";
import { Ranges } from "..";
// SVG
export const defaultStrokeProps: SVGAttributes<SVGElement> = {
	strokeLinejoin: "round",
	strokeLinecap: "round"
};
export const defaultTextProps: SVGAttributes<SVGTextElement> = {
	fill: "white"
};
export const strokeWidth = {
	min: 0.1,
	normal: 0.2
};
export const marginOffset = 0.8;
export const opacity = {
	bg: 1 / 10,
	side: 5 / 10,
	mainHidden: 6 / 10,
	main: 9 / 10
};

// Simplicity
export const stepBreakpoints = {
	11: 5,
	30: 10,
	45: 15,
	60: 20
} as const;

// Random
export const presetColors = [
	"#a855f7",
	"#ef4444",
	"#0ea5e9",
	"#22c55e",
	"#f59e0b",
	"#6366f1"
];

export const defaultRange: Ranges = { x: [-5, 5], y: [-5, 5] }