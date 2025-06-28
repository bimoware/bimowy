import { SVGAttributes } from "react"
import { randomAt } from "@/utils/random"

const ranges = {
	x: { min: -7, max: 7 },
	y: { min: -7, max: 7 }
}

const defaultPolyProps: SVGAttributes<SVGLineElement | SVGPolygonElement | SVGCircleElement> = {
	strokeWidth: 1,
	stroke: "white",
	strokeLinecap: "round",
	strokeLinejoin: "round"
}

const defaultSVGProps: SVGAttributes<SVGElement> = {
	viewBox: "0 0 100 100"
}

const randomFillClasses = [
	"fill-blue-500",
	"fill-fuchsia-600",
	"fill-orange-500",
	"fill-red-500",
];

type Point = {
	type: "point",
	id: string,
	x: number,
	y: number
}
type Vector = {
	type: "vector",
	id: string,
	startX: number, startY: number, endX: number, endY: number
}
type Elem = Point | Vector

type PlaneProps = {
	elems?: Elem[]
}
export default function Plane({ elems = [] }: PlaneProps) {
	return <div className="w-full h-full relative
	*:absolute *:w-full *:h-full
	pb-2">
		<PlaneBackground {...{ ranges }} />
		<X_Axis />
		<Y_Axis />
		{
			elems.filter(e => e.type === "point")
				.map(({ id, x, y }) => <Point key={id} {...{ x, y }} />)
		}
	</div>
}

function X_Axis() {
	return (
		<svg {...defaultSVGProps}>
			<line
				{...defaultPolyProps}
				x1="5" x2="95"
				y1="50" y2="50"
			/>
			<polygon
				{...defaultPolyProps}
				points="92,48 95,50 92,52"
				fill="white"
			/>
		</svg>
	)
}
function Y_Axis() {
	return (
		<svg {...defaultSVGProps}>
			<line
				{...defaultPolyProps}
				x1="50" x2="50"
				y1="5" y2="95"
			/>
			<polygon
				{...defaultPolyProps}
				points="48,8 50,5 52,8"
				fill="white"
			/>
		</svg>
	)
}
function getBetweenPercentage(min: number, max: number, n: number) {
	return ((n - min) / (max - min)) * 100
}
function PlaneBackground({ ranges }: {
	ranges: {
		x: { min: number, max: number },
		y: { min: number, max: number }
	}
}) {
	const [minX, maxX] = [ranges.x.min, ranges.x.max]
	const [minY, maxY] = [ranges.y.min, ranges.y.max]



	function generateIntegers(start: number, end: number) {
		const result = [];

		for (let i = start + 1; i < end; i++) {
			result.push(i);
		}
		return result;
	}


	function getBackgroundLineProps(p: number, horizental: boolean): SVGAttributes<SVGLineElement> {
		return {
			strokeWidth: 0.5,
			strokeOpacity: 0.2,
			...(
				horizental
					? {
						x1: 5, x2: 95, y1: p, y2: p
					}
					: {
						y1: 5, y2: 95, x1: p, x2: p
					}
			)
		}
	}

	return <>
		{/* Horizental lines */}
		<svg {...defaultSVGProps}>
			{
				generateIntegers(minX, maxX)
					.map(i => {
						return <line
							key={`horizental-${i}`}
							{...defaultPolyProps}
							{...getBackgroundLineProps(getBetweenPercentage(minX, maxX, i), true)}
						/>
					})
			}
		</svg>
		{/* Vertical lines */}
		<svg {...defaultSVGProps}>
			{
				generateIntegers(minY, maxY)
					.map(i => {
						return <line
							key={`vertical-${i}`}
							{...defaultPolyProps}
							{...getBackgroundLineProps(getBetweenPercentage(minY, maxY, i), false)}
						/>
					})
			}
		</svg>
	</>
}
function Point({ x, y }: {
	x: number, y: number
}) {
	const cx = getBetweenPercentage(-7, 7, x)
	const cy = getBetweenPercentage(-7, 7, -y)
	console.log({ cx, cy })
	return <svg {...defaultSVGProps}>
		<circle
			{...defaultPolyProps}
			{...{ cx, cy }}
			className={randomAt(randomFillClasses, "A")}
			fillOpacity={1}
			strokeWidth={0.8}
			r={2}
		/>
	</svg>
}