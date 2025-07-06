import TrigonometricCircle, { TrigonometricCircleProps } from "@cpn/math/TrigonometricCircle"
import TrigonometricTable, { TrigonometricTableProps } from "@cpn/math/TrigonometricTable"
import Plane from "@cpn/math/plane/Plane"
import { RawPlaneProps } from "./math/plane"

type WidgetComponents = {
	TrigonometricCircle: React.FC<TrigonometricCircleProps>
	TrigonometricTable: React.FC<TrigonometricTableProps>
	Plane: React.FC<RawPlaneProps>
}

const ALL_WIDGETS: WidgetComponents = {
	TrigonometricCircle,
	TrigonometricTable,
	Plane,
}

export default ALL_WIDGETS
