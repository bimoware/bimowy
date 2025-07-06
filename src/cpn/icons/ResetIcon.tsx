import { SVGAttributes } from "react"

const pathProps: SVGAttributes<SVGPathElement> = {
	stroke: "white", strokeWidth: 1.5,
	fill: "none",
	strokeLinecap: "round", strokeLinejoin: "round"
}
export default function ResetIcon({ onReset, resetable = true }: { resetable?: boolean, onReset: VoidFunction }) {
	return <button className={`h-full aspect-square
		-rotate-6 duration-150
		${resetable
			? "cursor-pointer opacity-90 hover:scale-95"
			: "cursor-not-allowed opacity-50"}`}
		onClick={onReset}>
		<svg viewBox="0 0 10 10">
			<path {...pathProps} d="M2,5 A 3 3 180 1 0 5,2" />
			<polygon {...pathProps} fill="white" points="4,2 5,1 5,3" />
		</svg>
	</button>
}