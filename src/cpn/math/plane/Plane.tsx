import Point from "./Point"
import PlaneBackground from "./PlaneBackground"
import Vector from "./Vector"
import Axis from "./Axis"
import { PlaneProps, getViewBox } from "."
import FunctionPlot from "./FunctionPlot"
import Circle from "./Circle"
import VectorFunctionPlot from "./VectorFunctionPlot"

export default function Plane({
	ranges, elems, excluded = []
}: PlaneProps) {
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
		<Axis {...{ ranges, excluded }} type="x" />
		<Axis {...{ ranges, excluded }} type="y" />
		<PlaneElements {...{ ranges, elems, excluded }} />
	</svg>
}

export function Defs() {
	return <defs>
		<filter id="shadow" x="-100" y="-100" width="1000" height="1000" filterUnits="userSpaceOnUse">
			<feDropShadow dx="0" dy="0.05" stdDeviation="0.1" floodColor="black" floodOpacity="0.5" />
		</filter>
	</defs>
}

export function PlaneElements({ elems = [], ranges }: PlaneProps) {
	return elems.map(elem => {
		switch (elem.type) {
			case "point":
				return <Point key={elem.id} {...elem} {...{ ranges }} />
			case "vector":
				return <Vector key={elem.id} {...elem} {...{ ranges }} />
			case "function":
				return <FunctionPlot key={elem.id} {...elem} {...{ ranges }} />
			case "vector-function":
				return <VectorFunctionPlot key={elem.id} {...elem} {...{ ranges }} />
			case "circle":
				return <Circle key={elem.id} {...elem} {...{ ranges }} />
		}
	})
} 