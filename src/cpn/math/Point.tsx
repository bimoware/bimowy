import { randomAt } from "@/utils/random";
import { defaultSVGProps, defaultPolyProps, randomFillClasses, getBetweenPercentage } from "./Plane";

export type PointProps = {
	type: "point",
	id: string,
	x: number,
	y: number
}

export function Point({ x, y, id }: PointProps) {
	const xCoor = getBetweenPercentage(-7, 7, x);
	const yCoor = getBetweenPercentage(-7, 7, -y);
	return <svg {...defaultSVGProps} {...{ id }}>
		<circle
			{...defaultPolyProps}
			cx={xCoor} cy={yCoor}
			className={randomAt(randomFillClasses, id)}
			stroke="white" strokeWidth={1}
			r={2} />
	</svg>;
}
