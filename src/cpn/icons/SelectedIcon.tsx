import { pathDefaultProps, svgDefaultProps } from ".";

export default function SelectedIcon({ selected, color }: { selected: boolean, color?: string }) {
	return <svg {...svgDefaultProps}>
		{
			selected
				? <path d="M2,5 L8,5" {...pathDefaultProps} stroke={color} />
				: <path d="M2,5 L8,5 M5,2 L5,8" {...pathDefaultProps} stroke={color} />
		}
	</svg>
}