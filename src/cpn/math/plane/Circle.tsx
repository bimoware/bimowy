import { CircleProps, defaultStrokeProps, getXCoor, getYCoor, opacity, Ranges, strokeWidth } from ".";

export default function Circle({ x, y, r, ranges, color }: CircleProps & { ranges: Ranges }) {
	return <g opacity={opacity.main} filter="url(#shadow)">
		{color && <circle {...defaultStrokeProps}
			cx={getXCoor(ranges, x)}
			cy={getYCoor(ranges, y)}
			r={r}
			stroke={"white"}
			fill="transparent"
			strokeWidth={strokeWidth.normal}
		/>}
		<circle {...defaultStrokeProps}
			cx={getXCoor(ranges, x)}
			cy={getYCoor(ranges, y)}
			r={r}
			stroke={color}
			fill="transparent"
			strokeWidth={strokeWidth.min}
		/>
	</g>
}