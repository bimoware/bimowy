import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

const rotations = [
	'',
	'hover:-rotate-1',
	'hover:rotate-1',
]

const translations = [
	'',
	'hover:translate-x-1',
	'hover:-translate-x-1',
	'hover:translate-y-1',
	'hover:-translate-y-1'
]

const skeletonNames = [
	10,
	21,
	7,
	18
].map(n => '.'.repeat(n))

const skeletonDescs = [
	97,
	72,
	140,
	213,
	150,
	49,
	116,
].map(n => '.'.repeat(n))

const skeletonTags = [
	[4, 10],
	[],
	[3, 9, 10]
].map(t => t.map(n => '.'.repeat(n)))

function randomAt<T>(list: T[], id: string): T {
	return list[id.charCodeAt(0) % list.length]
}

export function Card({ id, data, skeleton }: {
	id: string
} & ({
	data: {
		beta: boolean
		href: string
		name: string
		desc: string | null
		tags: string[]
	},
	skeleton?: false
} | { data?: null, skeleton: true })) {
	const beta = !skeleton && data.beta
	return (
		<Link
			{...(beta ? { title: "Beta" } : {})}
			href={!skeleton && data.href || ""}
			className={`w-fit max-w-1/3 h-fit p-4 px-8
    bg-neutral-700/20
    rounded-xl
    flex flex-col flex-wrap gap-1.5
    duration-150
    cursor-pointer
    hover:scale-105 hover:shadow-2xl hover:ring-2
    shadow-black/20 inset-shadow-xs inset-shadow-white/5
    group
    relative
		${!skeleton && data.beta && "!opacity-50"}
		${skeleton && "*:!opacity-0 bg-neutral-900/30"}
		${randomAt(rotations, id)}
		${randomAt(translations, id)}`}
		>
			{(!skeleton && data.beta) && <Image
				src="/svgs/warning.svg"
				alt="Beta"
				width={35}
				height={35}
				className={`absolute
            -left-4 -top-4
            duration-150
            -rotate-6
            group-hover:scale-105 group-hover:rotate-2
            select-none`}
			/>
			}
			<h4>{skeleton ? randomAt(skeletonNames, id) : data.name}</h4>
			<h5>{skeleton ? randomAt(skeletonDescs, id) : data.desc}</h5>

			{
				(skeleton || data.tags) && <div className='flex gap-2 flex-wrap justify-center'>
					{
						(skeleton ? randomAt(skeletonTags, id) : data.tags).map(tag => (
							<span key={tag} className='bg-white/10 px-2 py-1 rounded-full leading-4 shadow-md'>
								{tag}
							</span>
						))
					}
				</div>
			}
		</Link>
	)
}

export function CardLister({ title, children }: {
	title: string
	children: ReactNode
}) {
	return <div>
		<h1>{title}</h1>
		<div className="flex p-4 gap-6 w-full flex-wrap justify-center items-center">
			{children}
		</div>
	</div>

}