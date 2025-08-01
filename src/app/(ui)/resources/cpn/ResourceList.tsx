"use client"

import { AnyResourceBuilder } from "@/lib/resources"
import { Card } from "./Card"
import { useLanguage } from "@/lib/locale"
import { useState } from "react"
import { generateMetadataUtil } from "@cpn/sidebars/main"
import SelectedIcon from "@cpn/icons/SelectedIcon"

export async function generateMetadata() {
	return generateMetadataUtil('resources')
}

const RESOURCE_TYPES = [
	{
		id: "exercise",
		names: {
			en: "Exercises",
			fr: "Exercises"
		},
		icon: "/svgs/lab.svg"
	},
	{
		id: "tool",
		names: {
			en: "Tools",
			fr: "Outils"
		},
		icon: '/svgs/tool.svg'
	}
] as const

type ResourceID = typeof RESOURCE_TYPES[number]["id"]

export default function ResourceList({ resources }: {
	resources: ReturnType<AnyResourceBuilder["serialize"]>[]
}) {
	const lang = useLanguage()
	const allTypes = RESOURCE_TYPES.map(t => t.id)
	const [selectedTypes, setSelectedTypes] = useState<ResourceID[]>(allTypes)

	const handleToggle = (id: ResourceID) => {
		setSelectedTypes(selectedTypes => {
			const newSelectedTypes = [...selectedTypes]
			if (selectedTypes.includes(id)) {
				newSelectedTypes.splice(newSelectedTypes.indexOf(id), 1)
			} else {
				newSelectedTypes.push(id)
			}
			return newSelectedTypes
		})
	}
	return <div className="flex flex-col gap-2">
		<div className="flex items-center justify-center gap-2">
			{
				RESOURCE_TYPES.map(t => {
					const selected = selectedTypes.includes(t.id)
					return <div
						key={t.id}
						{...(
							selected ? { "data-selected": true } : {}
						)}
						className="
						select-none
						flex items-center gap-1
						bg-neutral-800
						data-selected:bg-white data-selected:text-black
						rounded-full
						px-2 py-0.5
						scale-90 data-selected:scale-100
						hover:scale-100 hover:data-selected:scale-105
						hover:cursor-pointer
						transition-all
						group"
						onClick={() => handleToggle(t.id)}>

						<SelectedIcon {...{ selected }}
							color={selected ? "black" : "white"} />
						{t.names[lang]}
					</div>
				})
			}
		</div>
		<div
			className="duration-150 flex p-4 gap-6 flex-wrap justify-center items-center">
			{
				resources
					.filter(r => selectedTypes.includes(r.type))
					.map(resource => <Card {...resource} key={resource.id} />)
			}
		</div>
	</div >
}