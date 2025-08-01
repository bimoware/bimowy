"use client"

import { AnyResourceBuilder } from "@/lib/resources"
import { Card } from "./Card"
import { useLanguage } from "@/lib/locale"
import { useState } from "react"
import { generateMetadataUtil } from "@cpn/sidebars/main"
import SelectedIcon from "@cpn/icons/SelectedIcon"
import { RESOURCES_DATA, ResourceID } from "@/lib/resources/builders/resource"

export async function generateMetadata() {
	return generateMetadataUtil('resources')
}

export default function ResourceList({ resources }: {
	resources: ReturnType<AnyResourceBuilder["serialize"]>[]
}) {
	const lang = useLanguage()
	const resourceTypes = Object.keys(RESOURCES_DATA) as ResourceID[]
	const [selectedTypes, setSelectedTypes] = useState<ResourceID[]>(resourceTypes)

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
				resourceTypes.map(type => {
					const data = RESOURCES_DATA[type]
					const selected = selectedTypes.includes(type)
					return <div
						key={type}
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
						onClick={() => handleToggle(type)}>

						<SelectedIcon {...{ selected }}
							color={selected ? "black" : "white"} />
						{data.names[lang]}
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