import { PlaneElementEnum, PlaneElementProps } from "..";
import { defaultStrokeProps, getXCoor, getYCoor, opacity, strokeWidth } from "../extra";

export default function Circle({ x, y, r, ranges, color }: PlaneElementProps<PlaneElementEnum.Circle>) {
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