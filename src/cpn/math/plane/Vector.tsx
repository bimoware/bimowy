import Arrow from "./Arrow"
import { opacity, Ranges, VectorProps } from "."

export default function Vector(props: { id: string } & VectorProps & { ranges: Ranges }) {
	return <g opacity={opacity.main}>
		<Arrow {...props}
			color={props.color}
			glow={{ width: 1 / 5 }}
			fixOffset
			shadow
		/>
	</g>
}