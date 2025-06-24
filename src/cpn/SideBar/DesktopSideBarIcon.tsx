"use client"

import { Route, Tag } from "@util/sidebar"
import { randomAt } from "@util/random"
import Image from "next/image"
import Link from "next/link"
import { useSelectedLayoutSegment, useSelectedLayoutSegments } from 'next/navigation'
import TooltipContainer from "../Tooltip"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const randoms = {
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
	tags
}: Route & { name: string }) {
	const [loading, setLoading] = useState(false)
	const t = useTranslations()
	const segments = useSelectedLayoutSegments()
	const isActive = segments.length ? segments.includes(path) : path === ""
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
					duration-150 
					hover:translate-x-0.5 hover:scale-105
					active:scale-90
					select-none
					m-1
					p-2
					${isBeta
						? "!opacity-30"
						: isActive
							? 'bg-neutral-50/5'
							: 'hover:bg-neutral-50/5 opacity-70'
					}
					${loading && (isBeta ? "!cursor-wait" : "!cursor-progress")}
					group`}
				onClick={() => setLoading(true)}
			>
				<Image
					className={`duration-150
						select-none
						w-8
						${randomAt(randoms["scale"], name)}
						${randomAt(randoms["rotations"], name)}
						${randomAt(randoms["translationsX"], name)}
						${randomAt(randoms["translationsY"], name)}`}
					src={loading && !isActive ? "/svgs/loading.svg" : icon}
					alt={name}
					width={100}
					height={100}
				/>
			</div>
		</Link>
	</TooltipContainer>
}
