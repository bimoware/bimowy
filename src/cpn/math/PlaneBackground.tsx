import { SVGAttributes } from "react";
import { defaultSVGProps, defaultPolyProps, getBetweenPercentage } from "./Plane";
import { generateIntegers } from "./util";

export function PlaneBackground({ ranges }: {
	ranges: {
		x: { min: number; max: number; };
		y: { min: number; max: number; };
	};
}) {
	const [minX, maxX] = [ranges.x.min, ranges.x.max];
	const [minY, maxY] = [ranges.y.min, ranges.y.max];

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
		};
	}

	return <>
		{/* Horizental lines */}
		<svg {...defaultSVGProps}>
			{generateIntegers(minX, maxX)
				.map(i => {
					return <line
						key={`horizental-${i}`}
						{...defaultPolyProps}
						{...getBackgroundLineProps(getBetweenPercentage(minX, maxX, i), true)} />;
				})}
		</svg>
		{/* Vertical lines */}
		<svg {...defaultSVGProps}>
			{generateIntegers(minY, maxY)
				.map(i => {
					return <line
						key={`vertical-${i}`}
						{...defaultPolyProps}
						{...getBackgroundLineProps(getBetweenPercentage(minY, maxY, i), false)} />;
				})}
		</svg>
	</>;
}
