import { randomAt } from "@/utils/random";
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

	return <svg {...defaultSVGProps} {...{ id }}>
		<circle {...defaultPolyProps}
			cx={xCoor} cy={yCoor}
			className={randomAt(randomFillClasses, id)}
			stroke="white" strokeWidth={1}
			r={2} />
	</svg>;
}
