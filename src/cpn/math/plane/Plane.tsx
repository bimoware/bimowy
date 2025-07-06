import { defaultRange, getViewBox, PartialPlaneProps } from "."
import PlaneBackground from "./Meta/PlaneBackground"
import Axis from "./Meta/Axis"
import Defs from "./Meta/Defs"
import { PlaneElements } from "./Elements/PlaneElements"

export default function Plane({
	ranges = defaultRange,
	elems = {},
	excluded = []
}: PartialPlaneProps) {
	const [xDiff, yDiff] = getViewBox(ranges).slice(2)
	return <svg
		viewBox={getViewBox(ranges).map(n => n).join(' ')}
		className="relative *:absolute
		h-full w-full
		*:w-full *:h-full"
		style={{
			aspectRatio: xDiff / yDiff
		}}>
		<Defs />
		<PlaneBackground {...{ ranges, excluded }} />
		{(['x', 'y'] as const).map(type => <Axis key={type} {...{ ranges, excluded, type }} />)}
		<PlaneElements {...{ ranges, elems, excluded }} />
	</svg>
}