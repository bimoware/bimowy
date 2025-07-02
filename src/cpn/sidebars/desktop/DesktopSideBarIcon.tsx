"use client"

import { Route, Tag } from "@cpn/sidebars/main"
import { randomAt } from "@/lib/extra"
import Image from "next/image"
import Link from "next/link"
import { useSelectedLayoutSegments } from 'next/navigation'
import TooltipContainer from "@/cpn/Tooltip"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const randomClasses = {
	"rotations": [
		'group-hover:-rotate-5',
		'group-hover:rotate-5',
	],
	"translationsX": [
		'group-hover:translate-x-0.5',
		'group-hover:translate-x-0.5',
		'group-hover:-translate-x-0.5'
	],
	"translationsY": [
		'group-hover:translate-y-0.5',
		'group-hover:-translate-y-0.5'
	],
	"scale": [
		'group-hover:scale-110',
		'group-hover:scale-105'
	]
}

export default function SideBarIcon({
	icon,
	path,
	name,
	tags,
	iconRounded
}: Route & { name: string }) {
	const [loading, setLoading] = useState(false)
	const t = useTranslations()
	const segments = useSelectedLayoutSegments()
	const pathParts = [...segments].filter(p => !p.includes('('))
	const isActive = pathParts.length
		? pathParts[0] === path
		: path === ""
	const isBeta = tags.includes(Tag.Beta)

	useEffect(() => {
		setLoading(false)
	}, [segments])

	return <TooltipContainer
		hidden={isBeta}
		tooltip={name + (isBeta ? ` (${t('unavailable')})` : "")}>
		<Link href={`/${path}`}>
			<div
				className={`
					aspect-square rounded-xl
					hover:translate-x-0.5 hover:scale-105
					active:scale-90
					select-none
					duration-150
					m-1
					p-2
					${isBeta
						? "!opacity-30"
						: isActive
							? 'bg-black/20 dark:bg-white/5'
							: `hover:bg-black/20 dark:hover:bg-white/5
							opacity-70`
					}
					${loading && (isBeta ? "!cursor-wait" : "!cursor-progress")}
					group`}
				onClick={() => setLoading(true)}
			>
				<Image
					className={`select-none
						duration-150
						w-8
						${iconRounded && "rounded-full"}
						${randomAt(randomClasses["scale"], name)}
						${randomAt(randomClasses["rotations"], name)}
						${randomAt(randomClasses["translationsX"], name)}
						${randomAt(randomClasses["translationsY"], name)}`}
					src={loading && !isActive ? "/svgs/loading.svg" : icon}
					alt={name}
					width={100}
					height={100}
				/>
			</div>
		</Link>
	</TooltipContainer>
}
