import TrigonometricCircle, { TrigonometricCircleProps } from "@cpn/math/TrigonometricCircle"
import Plane from "@cpn/math/plane/Plane"
import InteractivePlane from "@cpn/math/plane/InteractivePlane"
import { PartialPlaneProps } from "./math/plane"

type WidgetComponents = {
	TrigonometricCircle: React.FC<TrigonometricCircleProps>
	Plane: React.FC<PartialPlaneProps>
	InteractivePlane: React.FC
}

const ALL_WIDGETS: WidgetComponents = {
	TrigonometricCircle,
	Plane,
	InteractivePlane
}

export default ALL_WIDGETS
