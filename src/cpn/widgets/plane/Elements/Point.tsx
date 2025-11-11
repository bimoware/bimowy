import type { PlaneElementEnum, PlaneElementProps } from "../util";
import {
	defaultStrokeProps,
	getXCoor,
	getYCoor,
	opacity,
	strokeWidth
} from "../util";

export default function Point({
	x,
	y,
	ranges,
	color,
}: PlaneElementProps<PlaneElementEnum.Point>) {
	const xCoor = getXCoor(ranges, x);
	const yCoor = getYCoor(ranges, y);
	return (
		<g filter="url(#shadow)" opacity={opacity.main}>
			<circle
				{...defaultStrokeProps}
				cx={xCoor}
				cy={yCoor}
				fill="white"
				r={strokeWidth.normal}
				stroke="normal"
			/>
			<circle
				{...defaultStrokeProps}
				cx={xCoor}
				cy={yCoor}
				fill={color}
				r={strokeWidth.min}
				strokeWidth={0}
			/>
		</g>
	);
}
