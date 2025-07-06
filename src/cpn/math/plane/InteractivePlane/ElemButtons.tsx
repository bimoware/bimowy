import { HookSetter, randomAt } from "@/lib/extra"
import PlaneElementIcon from "@cpn/icons/PlaneElementIcon"
import { ElementSectionProps } from "./ElementSection"
import Button from "./Button"
import { numberToLetter } from "./util"
import { AnyPlaneElementData, PlaneElementEnum, presetColors } from ".."

const defaultElemCreators = [
	{
		id: "point",
		create: (id: string) => ({
			type: PlaneElementEnum.Point,
			id,
			color: randomAt(presetColors, id),
			x: 0,
			y: 0
		})
	},
	{
		id: "vector",
		create: (id: string) => ({
			type: PlaneElementEnum.Vector,
			id,
			color: randomAt(presetColors, id),
			x1: 1, y1: 1, x2: 2, y2: 3,
		})
	},
	{
		id: "scalar-function",
		create: (id: string) => ({
			type: PlaneElementEnum.ScalarFunction,
			id,
			color: randomAt(presetColors, id),
			f: Math.sin,
			interval: [0, Math.PI / 2]
		})
	},
	{
		id: "vector-function",
		create: (id: string) => ({
			type: PlaneElementEnum.VectorFunction,
			id,
			color: randomAt(presetColors, id),
			f: (t: number) => [1 / 2 * t * Math.cos(t), t],
			interval: [-10, 10]
		})
	},
	{
		id: "circle",
		create: (id: string) => ({
			type: PlaneElementEnum.Circle,
			id,
			color: randomAt(presetColors, id),
			x: 0,
			y: 0,
			r: 2,
		})
	}
] as const

export function ElementButtons({ setElems, nElements, setNElements }: {
	nElements: number,
	setNElements: HookSetter<number>,
	setElems: ElementSectionProps["setElems"]
}) {
	return <div className="w-full
					flex gap-3 flex-wrap items-center justify-center">
		{
			defaultElemCreators
				.map((defaultElem) => {
					const id = defaultElem.id as PlaneElementEnum
					return <Button
						key={id}
						label={`Add ${id.replaceAll('-', ' ')}`}
						icon={<PlaneElementIcon type={id} />}
						onClick={() => {
							setElems(prev => {
								const n = numberToLetter(nElements)
								setNElements(prev => prev + 1)
								return { ...prev, [n]: defaultElem.create(n) as AnyPlaneElementData }
							})
						}}
					/>
				})
		}
	</div>
}