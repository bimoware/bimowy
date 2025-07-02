import { randomAt } from "@/lib/extra"
import Image from "next/image"
import Link from "next/link"
import { AnyResourceBuilder, ResourceType } from "@/lib/resources"
import Latex from "react-latex-next"
import "katex/dist/katex.min.css"

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

export function Card({ id, beta, href, name, desc, type }: ReturnType<AnyResourceBuilder["serialize"]>) {
	return (
		<Link
			{...{ href }}
			className={`
				animate-appear
				w-fit
				max-w-full sm:max-w-2/5
				h-fit p-4 px-
				bg-black/20 dark:bg-white/5
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
			<div
				className="absolute
				-left-3 -top-3
				duration-150
				select-none
				flex gap-1"
			>
				<Image
					src={{
						[ResourceType.Exercise]: "/svgs/lab.svg",
						[ResourceType.Note]: "/svgs/note.svg",
						[ResourceType.Course]: "/svgs/course.svg"
					}[type]}
					alt={type}
					width={30}
					height={30}
				/>
				{
					beta && <Image
						src="/svgs/warning.svg"
						alt="Beta"
						width={30}
						height={30}
					/>
				}
			</div>
			<h4>{name}</h4>
			{
				desc && <h5>
					<Latex>
						{desc}
					</Latex>
				</h5>
			}
			{/* {
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
			} */}
		</Link >
	)
}