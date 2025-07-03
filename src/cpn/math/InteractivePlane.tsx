"use client"
import { useState } from "react";
import Plane, { ElemProps } from "./Plane";
import { PointProps } from "./Point";

export default function InteractivePLane() {

	const [elems, setElems] = useState<Record<string, ElemProps>>({})
	const ranges = { x: { min: -7, max: 7 }, y: { min: -7, max: 7 } }
	return <section className="w-full h-full flex">
		<div className="aspect-square">
			<Plane {...{ ranges, elems: Object.values(elems) }} />
		</div>
		<section className="w-full h-full bg-white/5
		flex flex-col items-center gap-4
		p-4">
			<button
				className="px-2 py-1
				bg-green-600 rounded-xl
				shadow-inner shadow-black/20
				cursor-pointer
				duration-150
				hover:scale-105"
				onClick={() => setElems(prev => {
					const elem = getDefaultButton(prev)
					return { ...prev, [elem.id]: elem }
				})}
			>
				Add point
			</button>
			{
				Object.values(elems)
					.filter(e => e.type == "point")
					.map(e => <section
						key={e.id}
						className="w-full bg-white/5 p-2 rounded-2xl text-xl">
						{
							(["x", "y"] as const).map(v => <div
								key={v}
								className="flex gap-2 items-center">
								<span>{v}:</span>
								<input
									type="text"
									onChange={(ev) => setElems(prev => {
										const newValue = Number(ev.target.value)
										const newElem = prev[e.id] as PointProps
										if (newValue) newElem[v] = newValue
										return { ...prev, [newElem.id]: newElem }
									})}
								/>
							</div>)
						}
					</section>)
			}
		</section>
	</section>
}

function getDefaultButton(elems: Record<string, ElemProps>) {
	return {
		type: "point" as const,
		id: String.fromCharCode(64 + Object.values(elems).length + 1),
		x: 0,
		y: 0
	}
}