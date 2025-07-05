import { ElemType } from "@cpn/math/plane";

const iconProps = {
	stroke: "white",
	fill: "white",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
} as const

export default function PlaneElementIcon({ type }: { type: ElemType }) {
	return <svg viewBox="0 0 10 10" width="1rem" height="1rem">
		<RawElementIcon {...{ type }} />
	</svg>
}

function RawElementIcon({ type }: { type: ElemType }) {
	switch (type) {
		case ElemType.Vector:
			return <polyline {...iconProps} points="2,8 6,4 8,6 8,2 4,2 6,4" />
		case ElemType.Point:
			return <circle {...iconProps} cx={5} cy={5} r={3} />
		case ElemType.ScalarFunction:
			return <path {...iconProps} d="M1,5 C 5,1 5,9 9,5" fill="none" />
	}
}