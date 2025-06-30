import { defaultSVGProps, defaultPolyProps, Ranges } from "./Plane";
import { generateIntegers } from "./util";

export function X_Axis({ ranges }: { ranges: Ranges }) {
	return (
		<svg {...defaultSVGProps} id='x-axis'>
			<line
				{...defaultPolyProps}
				x1="5" x2="95"
				y1="50" y2="50" />
			<polygon
				{...defaultPolyProps}
				points="92,48 95,50 92,52" />
		</svg>
	);
}
