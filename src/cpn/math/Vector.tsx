import { randomAt } from "@/utils/random";
import { defaultPolyProps, defaultStrokeProps, defaultSVGProps, getBetweenPercentage, PlaneProps, randomFillClasses, randomStrokeClasses } from "./Plane";
import { roundBetween } from "./util";

export type VectorProps = {
	x1: number, y1: number, x2: number, y2: number
}

export function Vector({ x1, x2, y1, y2, id, ranges }: { id: string } & VectorProps & PlaneProps) {

	const diffAngle = Math.PI / 2 + Math.PI / 4 + Math.PI / 12

	const [
		minX, maxX, minY, maxY
	] = [
			ranges.x.min, ranges.x.max, ranges.y.min, ranges.y.max
		]

	const xRange = [minX, maxX] as const
	const yRange = [minY, maxY] as const

	const offset = 0.05
	const offsetX = roundBetween(0.1, offset * Math.abs(x2 - x1), 0.25)
	const offsetY = roundBetween(0.1, offset * Math.abs(y2 - y1), 0.25)

	const offsetx1 = x1 == x2 ? 0 : x1 < x2 ? offsetX : -offsetX
	const offsety1 = y1 == y2 ? 0 : y1 < y2 ? -offsetY : offsetY
	const offsetx2 = x1 == x2 ? 0 : x1 < x2 ? -offsetX : offsetX
	const offsety2 = y1 == y2 ? 0 : y1 < y2 ? offsetY : -offsetY

	const x1Coor = getBetweenPercentage(...xRange, x1 + offsetx1)
	const x2Coor = getBetweenPercentage(...xRange, x2 + offsetx2)
	const y1Coor = getBetweenPercentage(...yRange, -y1 + offsety1)
	const y2Coor = getBetweenPercentage(...yRange, -y2 + offsety2)

	const angleScreen = Math.atan2(y2Coor - y1Coor, x2Coor - x1Coor);

	const leftAngleScreen = angleScreen + diffAngle;
	const rightAngleScreen = angleScreen - diffAngle;

	const vectorLength = Math.hypot(x2Coor - x1Coor, y2Coor - y1Coor);
	const headLength = roundBetween(3, vectorLength * 1 / 5, 5);

	const leftCoorX = x2Coor + headLength * Math.cos(leftAngleScreen);
	const leftCoorY = y2Coor + headLength * Math.sin(leftAngleScreen);
	const rightCoorX = x2Coor + headLength * Math.cos(rightAngleScreen);
	const rightCoorY = y2Coor + headLength * Math.sin(rightAngleScreen);

	const arrPoints = [
		[x2Coor, y2Coor],
		[leftCoorX, leftCoorY],
		[rightCoorX, rightCoorY]
	].map(grps => grps.join(',')).join(' ');

	// Label
	const sideAngle = angleScreen + Math.PI / 4

	const [biggestX, smallestX] = x2Coor > x1Coor ? [x2Coor, x1Coor] : [x1Coor, x2Coor]
	const [biggestY, smallestY] = y2Coor > y1Coor ? [y2Coor, y1Coor] : [y1Coor, y2Coor]

	const middleXCoor = smallestX + (biggestX - smallestX) / 2
	const middleYCoor = smallestY + (biggestY - smallestY) / 2

	const labelXCoor = middleXCoor - Math.max(6, headLength) * Math.cos(sideAngle)
	const labelYCoor = middleYCoor + Math.max(6, headLength) * Math.sin(sideAngle)

	// --
	const strokeColor = randomAt(randomStrokeClasses, id)
	const fillColor = randomAt(randomFillClasses, id)

	return <>
		<svg {...defaultSVGProps}  {...{ id }} opacity={0.9}>

			{/* Background */}
			<line
				{...defaultPolyProps}
				{...defaultStrokeProps}
				stroke="white" strokeWidth={3}
				x1={x1Coor} y1={y1Coor}
				x2={x2Coor} y2={y2Coor}
			/>
			<polygon
				{...defaultPolyProps}
				{...defaultStrokeProps}
				stroke="white" strokeWidth={3}
				points={arrPoints}
			/>
			{/* Actual arrow */}
			<line
				{...defaultStrokeProps}
				className={strokeColor}
				strokeWidth={1}
				x1={x1Coor} y1={y1Coor}
				x2={x2Coor} y2={y2Coor}
			/>
			<polygon
				{...defaultStrokeProps}
				className={`${strokeColor} ${fillColor}`}
				strokeWidth={1}
				points={arrPoints}
			/>
			{/* Label */}

			<text
				{...defaultPolyProps}
				stroke="white" strokeWidth={1.5}
				x={labelXCoor} y={labelYCoor}
				fontSize={8}
				textAnchor="middle"
			>{id}</text>
			<text
				{...defaultPolyProps}
				className={randomAt(randomFillClasses, id)}
				strokeWidth={0}
				x={labelXCoor} y={labelYCoor}
				fontSize={8}
				textAnchor="middle"
			>{id}</text>

		</svg>
	</>
}