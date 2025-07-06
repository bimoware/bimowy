import { pathDefaultProps, svgDefaultProps } from ".";

export default function DeleteIcon({ onDelete }: { onDelete: VoidFunction }) {
	return <svg {...svgDefaultProps} onClick={onDelete}>
		<path {...pathDefaultProps} d="M2,2 3,8 7,8 8,2 2,2" />
	</svg>
}