import { randomAt } from "@/lib/extra";
import { defaultSVGProps, defaultPolyProps, randomFillClasses, getBetweenPercentage, PlaneProps } from "./Plane";

export type PointProps = {
	type: "point",
	id: string,
	x: number,
	y: number
}

export function Point({ x, y, id, ranges }: PointProps & PlaneProps) {
	const [
		xRange, yRange
	] = [
		[ranges.x.min, ranges.x.max], [ranges.y.min, ranges.y.max]
	] as const

	const xCoor = getBetweenPercentage(...xRange, x);
	const yCoor = getBetweenPercentage(...yRange, -y);

	return <svg {...defaultSVGProps} {...{ id }} opacity={0.9}>
		<circle {...defaultPolyProps}
			cx={xCoor} cy={yCoor}
			className={randomAt(randomFillClasses, id)}
			stroke="white" strokeWidth={1}
			r={2} />
		<text
			{...defaultPolyProps}
			stroke="white"
			strokeWidth={1.5}
			x={xCoor + 2.5} y={yCoor - 2.5}
			fontSize={8}
		>{id}</text>
		<text
			{...defaultPolyProps}
			className={randomAt(randomFillClasses, id)}
			strokeWidth={0}
			x={xCoor + 2.5} y={yCoor - 2.5}
			fontSize={8}
		>{id}</text>
	</svg >;
}
