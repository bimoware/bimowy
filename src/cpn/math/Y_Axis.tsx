import { defaultSVGProps, defaultPolyProps, Ranges } from "./Plane";

export function Y_Axis({ ranges }: { ranges: Ranges }) {
	return (
		<svg {...defaultSVGProps} id='y-axis'>
			<line
				{...defaultPolyProps}
				x1="50" x2="50"
				y1="5" y2="95" />
			<polygon
				{...defaultPolyProps}
				points="48,8 50,5 52,8" />
		</svg>
	);
}
