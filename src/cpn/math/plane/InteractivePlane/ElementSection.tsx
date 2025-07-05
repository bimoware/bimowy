import PlaneElementIcon from "@cpn/icons/PlaneElementIcon"
import Button from "./Button"
import { ElemProps, ElemType, PointProps, randomColors, ScalarFunctionProps, VectorProps } from ".."
import { Dispatch, SetStateAction } from "react"
import { numberToLetter } from "./util"
import { randomAt } from "@/lib/extra"

type ElementSectionProps = {
	elems: ElemProps[],
	setElems: Dispatch<SetStateAction<ElemProps[]>>
}
export default function ElementSection({ elems, setElems }: ElementSectionProps) {
	return <>
		<ElementButtons {...{ setElems }} />
		<ElemConfigs {...{ elems, setElems }} />
	</>
}

function ElemConfigs({ elems }: ElementSectionProps) {
	return elems.map(elem => <section key={elem.id} className="w-full
		bg-white/5
		p-2 px-3
		flex gap-3 items-center">
		<PlaneElementIcon type={elem.type} />
		{elem.id}
	</section>)
}

function createPoint(id: string): PointProps {
	return {
		type: ElemType.Point,
		id,
		x: 0,
		y: 0,
		color: randomAt(randomColors, id)
	}
}

function createVector(id: string): VectorProps {
	return {
		type: ElemType.Vector,
		id,
		x1: 1, y1: 1, x2: 2, y2: 3,
		color: randomAt(randomColors, id)
	}
}

function createScalarFunction(id: string): ScalarFunctionProps {
	return {
		type: ElemType.ScalarFunction,
		id,
		f: Math.sin,
		color: randomAt(randomColors, id)
	}
}
function ElementButtons({ setElems }: { setElems: ElementSectionProps["setElems"] }) {
	return <div className="w-full
					flex gap-3 flex-wrap items-center justify-center">
		<Button
			label="Add point"
			icon={<PlaneElementIcon type={ElemType.Point} />}
			onClick={() => {
				setElems(prev => [
					...prev,
					createPoint(numberToLetter(prev.length))
				])
			}}
		/>
		<Button
			label="Add vector"
			icon={<PlaneElementIcon type={ElemType.Vector} />}
			onClick={() => {
				setElems(prev => [
					...prev,
					createVector(numberToLetter(prev.length))
				])
			}}
		/>
		<Button
			label="Add vector function"
			icon={<PlaneElementIcon type={ElemType.ScalarFunction} />}
			onClick={() => {
				setElems(prev => [
					...prev,
					createScalarFunction(numberToLetter(prev.length))
				])
			}}
		/>
	</div>
}