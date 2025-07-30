import ALL_WIDGETS from "@/cpn/widgets"
import { TrigonometricTableProps } from "./math/TrigonometricTable"
import { TrigonometricCircleProps } from "./math/TrigonometricCircle"
import { PartialPlaneProps } from "./math/plane"

type Props<T extends keyof typeof ALL_WIDGETS> = {
	id: T,
	props: React.ComponentPropsWithRef<typeof ALL_WIDGETS[T]>
}

export function Widget({ id, props }: Props<keyof typeof ALL_WIDGETS>) {

	switch (id) {
		case "TrigonometricCircle":
			return <ALL_WIDGETS.TrigonometricCircle {...(props as TrigonometricCircleProps)} />

		case "TrigonometricTable":
			return <ALL_WIDGETS.TrigonometricTable {...(props as TrigonometricTableProps)} />

		case "Plane":
			return <ALL_WIDGETS.Plane {...(props as PartialPlaneProps)} />

		default:
			return null
	}
}
