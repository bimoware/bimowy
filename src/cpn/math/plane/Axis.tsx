import { Ranges, getXCoor, getYCoor, marginOffset, getBreakPoint, defaultTextProps, AxisOption, Excluded, strokeWidth, defaultStrokeProps, opacity } from ".";
import { generateIntegers } from "..";
import Arrow from "./Arrow";

export default function Axis({ ranges, type, excluded }: {
	ranges: Ranges
	excluded: Excluded[]
	type: AxisOption
}) {
	const step = getBreakPoint(ranges)
	const middle = type == "x" ? getYCoor(ranges, 0) : getXCoor(ranges, 0)
	return <g opacity={opacity.side}>
		{
			!excluded.includes(type == "x" ? 'x-axis' : 'y-axis')
			&& <Arrow {...{ ranges }}
				{...(type == "x"
					? {
						x1: ranges.x[0] - 2 * marginOffset / 3,
						x2: ranges.x[1] + 2 * marginOffset / 3,
						y1: 0,
						y2: 0
					}
					: {
						x1: 0,
						x2: 0,
						y1: ranges.y[0] - 2 * marginOffset / 3,
						y2: ranges.y[1] + 2 * marginOffset / 3
					}
				)}
			/>
		}
		{
			!excluded.includes(type == "x" ? 'x-labels' : 'y-labels')
			&& generateIntegers(...ranges[type])
				.map(n => {
					if (n == 0) return;
					const markerWidth = 1 / 10
					const isBreakPoint = step !== 1 && n % step === 0
					const lineWidth = strokeWidth.min * (isBreakPoint ? 1.5 : 1)
					const fontSize = 1 / 3 * (isBreakPoint ? 1.5 : 1)

					const coor = type == "x" ? getXCoor(ranges, n) : getYCoor(ranges, n)
					return <g key={n} opacity={(step != 1 && !isBreakPoint) ? 3 / 4 : 1}>
						<line {...defaultStrokeProps}
							strokeWidth={lineWidth} stroke="white"
							{...(type == "x"
								? {
									y1: middle - markerWidth,
									y2: middle + markerWidth,
									x1: coor,
									x2: coor
								}
								: {
									x1: middle - markerWidth,
									x2: middle + markerWidth,
									y1: coor,
									y2: coor
								}
							)}
						/>
						<text {...defaultTextProps} {...{ fontSize }}
							{...(type === "x"
								? { textAnchor: "middle", y: middle + fontSize * 1.4, x: coor }
								: { textAnchor: "end", x: middle - fontSize / 1.4, y: coor + fontSize / 3 }
							)}
						>
							{n}
						</text>
					</g>
				})
		}
	</g>
}
