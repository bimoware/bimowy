import { randomAt } from "@util/random";
import Image from "next/image";
import Link from "next/link";

const randomRotations = [
	'hover:-rotate-1',
	'hover:-rotate-2',
	'hover:rotate-1',
	'hover:rotate-2'
]

export function Mention({ icon, name, href, background, padding, ultra, notrounded }: {
	notrounded?: boolean
	icon: string;
	name: string;
	hoverName?: string;
	href?: string;
	background?: boolean;
	padding?: boolean;
	ultra?: boolean;
}) {
	return (
		<Link
			{...(href ? { href, target: '_blank' } : { href: '' })}
			className={`inline-flex gap-2 items-center justify-evenly
      p-1 px-2
      rounded-2xl
      transition-all
      select-all cursor-pointer
      group
      duration-150
			${randomAt(randomRotations, name)}
      ${ultra
					? `bg-white/90 hover:bg-white/80
          hover:gap-3
          hover:-translate-y-2
          hover:grayscale-[10%]`
					: `bg-neutral-700/70 hover:bg-white/10
					shadow-black/20 shadow-lg`}`}
		>
			<Image
				src={icon}
				width={70}
				height={70}
				alt={name}
				className={`h-5 md:h-8 w-fit
          aspect-square
          select-none
          group-hover:scale-105 duration-150
          ${!notrounded && "rounded-full"}
          ${background && "bg-black"}
          ${padding && "p-1"}
          ${ultra && "group-hover:scale-105"}`}
			/>
			<span key="main" className={`group-hover:font-bold transition-all
				${ultra && "invert"}`}>
				{name}
			</span>
			{href && (
				<Image
					src="/svgs/open_in_view.svg"
					width={50}
					height={50}
					alt="Open"
					className={`w-0 h-4 -ml-1
          group-hover:w-4
          transition-all duration-300
          aspect-square self-baseline
					${ultra && "group-hover:invert"}`}
				/>
			)
			}
		</Link >
	);
}