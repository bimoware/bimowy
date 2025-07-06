import { PlaneElementsConfigs } from "./PlaneElementsConfigs"
import { ElementButtons } from "./ElemButtons"
import { HookSetter } from "@/lib/extra"
import { AnyPlaneElementData } from ".."

export type ElementSectionProps = {
	nElements: number,
	setNElements: HookSetter<number>
	elems: Record<string, AnyPlaneElementData>,
	setElems: HookSetter<ElementSectionProps["elems"]>
}
export default function ElementSection({ elems, setElems, nElements, setNElements }: ElementSectionProps) {
	return <>
		<ElementButtons {...{ setElems, nElements, setNElements }} />
		<PlaneElementsConfigs {...{ elems, setElems, setNElements }} />
	</>
}
