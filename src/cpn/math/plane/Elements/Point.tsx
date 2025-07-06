import { PlaneElementEnum, PlaneElementProps } from "..";
import { defaultStrokeProps, getXCoor, getYCoor, opacity, strokeWidth } from "../extra";

export default function Point({ x, y, ranges, color }: PlaneElementProps<PlaneElementEnum.Point>) {
	const xCoor = getXCoor(ranges, x)
	const yCoor = getYCoor(ranges, y);
	return <g opacity={opacity.main}
		filter="url(#shadow)">
		<circle {...defaultStrokeProps}
			cx={xCoor} cy={yCoor}
			fill="white"
			r={strokeWidth.normal}
			stroke="normal"
		/>
		<circle {...defaultStrokeProps}
			cx={xCoor} cy={yCoor}
			fill={color}
			strokeWidth={0}
			r={strokeWidth.min}
		/>
	</g>
}
