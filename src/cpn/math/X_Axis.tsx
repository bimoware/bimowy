import { Fragment } from "react";
import { defaultSVGProps, defaultPolyProps, Ranges, getBetweenPercentage } from "./Plane";
import { generateIntegers } from "./util";

export function X_Axis({ ranges }: { ranges: Ranges }) {
	const [xMin, xMax] = [ranges.x.min, ranges.x.max]
	return (
		<svg {...defaultSVGProps} id='x-axis'>
			<line
				{...defaultPolyProps}
				x1="5" x2="95"
				y1="50" y2="50" />
			<polygon
				{...defaultPolyProps}
				points="92,48 95,50 92,52" />
			{
				generateIntegers(xMin, xMax)
					.map(n => {
						if (n == 0) return;
						const x = getBetweenPercentage(xMin, xMax, n)
						return <Fragment key={n}>
							<line {...defaultPolyProps}
								x1={x} x2={x}
								y1={49} y2={51}
							/>
							<text {...defaultPolyProps}
								strokeWidth={0}
								fontSize={3}
								textAnchor="middle"
								y={55}
								{...{ x }}>
								{n}
							</text>
						</Fragment>
					})
			}
		</svg>
	);
}
