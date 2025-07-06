import { generateIntegers } from "@cpn/math";
import { defaultStrokeProps, marginOffset, opacity, strokeWidth, getXCoor, getYCoor, Excludables, Ranges } from "..";

export default function PlaneBackground({ ranges, excluded }: { ranges: Ranges, excluded: Excludables[] }) {
	if (excluded?.includes('bg')) return;
	return <g opacity={opacity.bg}>
		<g>
			{generateIntegers(...ranges.y)
				.map(i => {
					const yCoor = getYCoor(ranges, i)
					return <line {...defaultStrokeProps}
						strokeWidth={strokeWidth.min}
						stroke="white"
						key={`horizental-${i}`}
						x1={getXCoor(ranges, ranges.x[0]) - marginOffset / 2}
						x2={getXCoor(ranges, ranges.x[1]) + marginOffset / 2}
						y1={yCoor} y2={yCoor}
					/>;
				})}
		</g>
		<g>
			{generateIntegers(...ranges.x)
				.map(i => {
					const xCoor = getXCoor(ranges, i)
					return <line {...defaultStrokeProps}
						strokeWidth={strokeWidth.min}
						stroke="white"
						key={`vertical-${i}`}
						y1={getYCoor(ranges, ranges.y[1]) - marginOffset / 2}
						y2={getYCoor(ranges, ranges.y[0]) + marginOffset / 2}
						x1={xCoor} x2={xCoor}
					/>;
				})}
		</g>
	</g>
}
