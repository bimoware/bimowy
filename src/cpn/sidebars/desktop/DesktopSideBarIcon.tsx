"use client"

import { Route, Tag } from "@cpn/sidebars/main"
import { randomAt } from "@/lib/extra"
import Image from "next/image"
import Link from "next/link"
import { useSelectedLayoutSegments } from 'next/navigation'
import TooltipContainer from "@/cpn/Tooltip"
import { useTranslations } from "next-intl"

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
	iconFree
}: Route & { name: string }) {
	const t = useTranslations()
	const segments = useSelectedLayoutSegments()
	const pathParts = [...segments].filter(p => !p.includes('('))
	const isActive = pathParts.length
		? pathParts[0] === path
		: path === ""
	const isBeta = tags.includes(Tag.Beta)

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
					${iconFree ? "p-1" : "p-2"}
					${!iconFree && (
						isBeta
							? "!opacity-30"
							: isActive
								? 'bg-black/20 dark:bg-white/5'
								: `hover:bg-black/20 dark:hover:bg-white/5
							opacity-70`
					)}
					group`}
			>
				<Image
					className={`select-none
						duration-150
						${iconFree ? "w-11" : "w-8"}
						${randomAt(randomClasses["scale"], name)}
						${randomAt(randomClasses["rotations"], name)}
						${randomAt(randomClasses["translationsX"], name)}
						${randomAt(randomClasses["translationsY"], name)}`}
					src={icon}
					alt={name}
					width={100}
					height={100}
				/>
			</div>
		</Link>
	</TooltipContainer>
}
