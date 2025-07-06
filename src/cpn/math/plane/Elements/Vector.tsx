import { opacity, PlaneElementEnum, PlaneElementProps } from ".."
import Arrow from "../Meta/Arrow"

export default function Vector(props: { id: string } & PlaneElementProps<PlaneElementEnum.Vector>) {
	return <g opacity={opacity.main}>
		<Arrow {...props}
			color={props.color}
			glow={{ width: 1 / 5 }}
			fixOffset
			shadow
		/>
	</g>
}