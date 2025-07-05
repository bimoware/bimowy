import ALL_WIDGETS from "@/cpn/widgets"
import { PlaneProps } from "./math/plane"
import { TrigonometricTableProps } from "./math/TrigonometricTable"
import { TrigonometricCircleProps } from "./math/TrigonometricCircle"

type Props<T extends keyof typeof ALL_WIDGETS> = {
	id: T,
	props: React.ComponentPropsWithRef<typeof ALL_WIDGETS[T]>
}

export async function Widget({ id, props }: Props<keyof typeof ALL_WIDGETS>) {

	switch (id) {
		case "TrigonometricCircle":
			return <ALL_WIDGETS.TrigonometricCircle {...(props as TrigonometricCircleProps)} />

		case "TrigonometricTable":
			return <ALL_WIDGETS.TrigonometricTable {...(props as TrigonometricTableProps)} />

		case "Plane":
			return <ALL_WIDGETS.Plane {...(props as PlaneProps)} />

		default:
			return null
	}
}
