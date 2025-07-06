import { Fragment } from "react"
import { DefaultPlaneElementProps, defaultStrokeProps, getXCoor, getYCoor, marginOffset, opacity, Range, Ranges, strokeWidth } from ".."

type VectorFunction = (t: number) => Range

function getPaths(ranges: Ranges, f: VectorFunction, interval: Range) {
	const step = Math.PI / 2 / 3 / 4 / 5
	const [minY, maxY] = [ranges.y[0] - marginOffset / 2, ranges.y[1] + marginOffset / 2]
	const [minX, maxX] = [ranges.x[0] - marginOffset / 2, ranges.x[1] + marginOffset / 2]
	const paths: string[][] = [[]]

	for (let t = interval[0]; t <= interval[1]; t += step) {
		const [x, y] = f(t)
		if ((!isFinite(x) || !isFinite(y))
			|| (x < minX || x > maxX)
			|| (y < minY || y > maxY)) {
			if (paths.length && paths[paths.length - 1].length != 0) paths.push([])
		} else {
			paths[paths.length - 1].push(
				`${getXCoor(ranges, x)},${getYCoor(ranges, y)}`
			)
		}
	}

	return paths
}

export default function FunctionPlot({ ranges, f, interval, color }: {
	ranges: Ranges,
	f: VectorFunction,
	interval?: Range
	color: DefaultPlaneElementProps["color"]
}) {
	const paths = getPaths(ranges, f, interval ?? ranges.x)
	return (
		<g opacity={opacity.main} filter="url(#shadow)">
			{
				paths.map((p, i) => <Fragment key={i}>
					{/* Glow behind */}
					<polyline {...defaultStrokeProps}
						points={p.join(' ')}
						strokeWidth={strokeWidth.normal}
						stroke="white"
						fill="none"
					/>
					{/* Actual line */}
					<polyline {...defaultStrokeProps}
						points={p.join(' ')}
						strokeWidth={strokeWidth.min}
						stroke={color}
						fill="none"
					/>
				</Fragment>)
			}
		</g>
	)
}
