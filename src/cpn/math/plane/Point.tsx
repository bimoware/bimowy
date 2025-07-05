import { getXCoor, getYCoor, PointProps, Ranges, strokeWidth, defaultStrokeProps, opacity } from ".";

export default function Point({ x, y, ranges, color }: PointProps & { ranges: Ranges }) {
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
