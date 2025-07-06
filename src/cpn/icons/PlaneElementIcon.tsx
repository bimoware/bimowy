import { PlaneElementEnum } from "@cpn/math/plane";
import { pathDefaultProps, svgDefaultProps } from ".";

export default function PlaneElementIcon({ type }: { type: PlaneElementEnum }) {
	return <svg {...svgDefaultProps}>
		<RawElementIcon {...{ type }} />
	</svg>
}

function RawElementIcon({ type }: { type: PlaneElementEnum }) {
	switch (type) {
		case PlaneElementEnum.Vector:
			return <polyline {...pathDefaultProps} points="2,8 6,4 8,6 8,2 4,2 6,4" fill="white" />
		case PlaneElementEnum.Point:
			return <circle {...pathDefaultProps} cx={5} cy={5} r={3} fill="white" />
		case PlaneElementEnum.ScalarFunction:
			return <path {...pathDefaultProps} d="M1,5 C 5,1 5,9 9,5" />
		case PlaneElementEnum.VectorFunction:
			return <>
				<path {...pathDefaultProps} d="M1,5 C 5,1 5,9 9,5" />
				<line {...pathDefaultProps} strokeWidth={pathDefaultProps.strokeWidth / 2} x1={5} y1={9} x2={1} y2={5.5} />
				<line {...pathDefaultProps} strokeWidth={pathDefaultProps.strokeWidth / 2} x1={5} y1={9} x2={4} y2={4} />
				<line {...pathDefaultProps} strokeWidth={pathDefaultProps.strokeWidth / 2} x1={5} y1={9} x2={9} y2={5.5} />
			</>
		case PlaneElementEnum.Circle:
			return <circle {...pathDefaultProps} cx={5} cy={5} r={3} />
	}
}