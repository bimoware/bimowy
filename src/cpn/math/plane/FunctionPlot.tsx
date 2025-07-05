import { getXCoor, getYCoor, FunctionProps, Ranges, strokeWidth, defaultStrokeProps, opacity } from "."
import { Fragment } from "react"

export default function FunctionPlot({ ranges, f, color }: FunctionProps & { ranges: Ranges }) {
	const step = Math.PI / 2 / 3 / 4 / 5
	const [minY, maxY] = [ranges.y[0] - 1 / 2, ranges.y[1] + 1 / 2]
	const [minX, maxX] = [ranges.x[0] - 1 / 2, ranges.x[1] + 1 / 2]
	const paths: string[][] = []

	for (let x = minX; x <= maxX; x += step) {
		const y = f(x)
		if (!isFinite(y) || y < minY || y > maxY) {
			if (paths.length && paths[paths.length - 1].length != 0) paths.push([])
		} else {
			if (!paths.length) paths.push([])
			paths[paths.length - 1].push(`${getXCoor(ranges, x).toFixed(3)},${getYCoor(ranges, y).toFixed(3)}`)
		}
	}

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
