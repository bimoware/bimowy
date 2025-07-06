"use client"
import PlaneElementIcon from "@cpn/icons/PlaneElementIcon";
import { AnyPlaneElementData } from "..";
import NumberInput from "@cpn/ui/NumberInput";
import { ElementSectionProps } from "./ElementSection";
import { ReactNode, useState } from "react";
import ChevronToggleIcon from "@cpn/icons/ChevronToggleIcon";
import DeleteIcon from "@cpn/icons/DeleteIcon";
import { HookSetter } from "@/lib/extra";

type PlaneElementsConfigProps = {
	elems: Record<string, AnyPlaneElementData>,
	setElems: HookSetter<PlaneElementsConfigProps["elems"]>
}

export function PlaneElementsConfigs({ elems, setElems }: PlaneElementsConfigProps) {
	return Object.keys(elems).map(id => <PlaneElementsConfig key={id} {...{ id, elems, setElems }} />)
}

function PlaneElementsConfig({ elems, setElems, id }: PlaneElementsConfigProps & { id: string }) {
	const elem = elems[id]
	const [isOpen, setIsOpen] = useState(true)

	return <section className="w-full
			bg-white/5
			p-2 px-3
			flex flex-col gap-3
			!rounded-2xl">
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2 w-full" onClick={() => setIsOpen(prev => !prev)}>
				<PlaneElementIcon type={elem.type} />
				{id}
			</div>
			<div className="flex items-center gap-2">
				<ChevronToggleIcon {...{ isOpen, setIsOpen }} />
				<DeleteIcon onDelete={() => setElems(prev => {
					const newElems = { ...prev }
					delete newElems[id]
					return newElems
				})} />
			</div>
		</div>
		{isOpen && <div className="flex flex-wrap gap-2">
			<AllElemConfig {...{ elem, id, setElems }} />
		</div>}
	</section >
}

function AllElemConfig({ elem, id, setElems }: {
	setElems: ElementSectionProps["setElems"]
	elem: AnyPlaneElementData,
	id: string
}) {
	const configs: Record<string, ReactNode> = {}
	const numberInputNames = ['x', 'y', 'r', 'x1', 'y1', 'x2', 'y2'] as const
	{
		numberInputNames
			.map(name => {
				if (!(name in elem)) return;
				const value = elem[name as keyof typeof elem] as unknown as number
				configs[name] = <NumberInput key={`${id}-${name}`} {...{ value }}
					setValue={(v) => setElems(prev => ({ ...prev, [id]: { ...prev[id], [name]: v } }))}
				/>
			})
	}
	return Object.entries(configs).map(([id, c]) => <div key={id}
		className="bg-white/5 rounded-lg px-1.5 py-1 flex gap-1">{id} = {c}</div>)
}