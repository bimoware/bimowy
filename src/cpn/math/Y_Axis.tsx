import { Fragment } from "react";
import { defaultSVGProps, defaultPolyProps, Ranges, getBetweenPercentage } from "./Plane";
import { generateIntegers } from "./util";

export function Y_Axis({ ranges }: { ranges: Ranges }) {
	const [yMin, yMax] = [ranges.x.min, ranges.x.max]
	return (
		<svg {...defaultSVGProps} id='y-axis'>
			<line
				{...defaultPolyProps}
				x1="50" x2="50"
				y1="5" y2="95" />
			<polygon
				{...defaultPolyProps}
				points="48,8 50,5 52,8" />
			{
				generateIntegers(yMin, yMax)
					.map(n => {
						if (n == 0) return;
						const y = getBetweenPercentage(yMin, yMax, -n)
						return <Fragment key={n}>
							<line {...defaultPolyProps}
								y1={y} y2={y}
								x1={49} x2={51}
							/>
							<text {...defaultPolyProps}
								strokeWidth={0}
								fontSize={3}
								textAnchor="middle"
								x={46}
								y={y + 1}>
								{n}
							</text>
						</Fragment>
					})
			}
		</svg>
	);
}
