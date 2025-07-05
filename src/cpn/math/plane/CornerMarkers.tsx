import { defaultStrokeProps, getXCoor, getYCoor, Ranges } from ".";

export default function CornerMarkers({ ranges }: { ranges: Ranges }) {
	const [xMin, yMin, xMax, yMax] = [
		getXCoor(ranges, ranges.x[0]),
		getYCoor(ranges, ranges.y[0]),
		getXCoor(ranges, ranges.x[1]),
		getYCoor(ranges, ranges.y[1])
	]
	return <g>
		{
			([
				[xMin, yMin, "red"],
				[xMin, yMax, "blue"],
				[xMax, yMin, "green"],
				[xMax, yMax, "yellow"]
			] as const).map((c, i) => <circle {...defaultStrokeProps}
				key={i}
				cx={c[0]} cy={c[1]}
				r={1} fill={c[2]}
			/>)
		}
	</g>
}