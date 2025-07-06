import { HookSetter } from "@/lib/extra";
import { pathDefaultProps, svgDefaultProps } from ".";

export default function ChevronToggleIcon({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: HookSetter<boolean> }) {
	return <button onClick={() => setIsOpen(prev => !prev)}>
		<svg {...svgDefaultProps}>
			<path {...pathDefaultProps}
				d={`M 2,4 L ${isOpen ? "5,6" : "5,2"} L 8,4`} />
		</svg>
	</button>
}