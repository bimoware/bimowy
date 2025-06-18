import { randomAt } from "@util/random"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

import "katex/dist/katex.min.css"
import Latex from "react-latex-next"

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

export function Card({ id, beta, href, name, desc, isDescLatex, tags }: {
	href: string
	id: string
	beta: boolean
	name: string
	desc?: string
	isDescLatex?: boolean,
	tags?: string[]
}) {
	return (
		<Link
			{...(beta ? { title: "Beta" } : {})}
			{...{ href }}
			className={`
				animate-appear
				w-fit
				max-w-full md:max-w-2/5
				h-fit p-4 px-8
				bg-neutral-700/20
				rounded-2xl
    		flex flex-col flex-wrap gap-1.5
    		duration-150
    		${beta
					? "hover:scale-95 !opacity-50"
					: "hover:scale-105 hover:ring-2 cursor-pointer"}
    		inset-shadow-xs inset-shadow-white/5
    		group
    		relative
		${randomAt(rotations, id)}
		${randomAt(translations, id)}`}
		>
			{
				(beta) && <Image
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
			<h4>{name}</h4>
			{
				desc && <h5>{isDescLatex ? <Latex>{desc}</Latex> : desc}</h5>
			}

			{
				tags && <div
					className='flex gap-2 flex-wrap justify-center mt-1'>
					{
						tags.map(tag => (
							<span key={tag}
								className='
								bg-white/10 text-white/80
								px-2
								rounded-full
								shadow-sm'>
								{tag}
							</span>
						))
					}
				</div>
			}
		</Link >
	)
}
export function CardLister({ title, children }: {
	title: string
	children: ReactNode
}) {
	return <div>
		<h1>{title}</h1>
		<div
			className="duration-150 flex p-4 gap-6 w-full flex-wrap justify-center items-center">
			{children}
		</div>
	</div>

}