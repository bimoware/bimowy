"use client"
import { useAuthUser } from "@/db/util";
import { LanguageCode } from "@/utils/locale";
import { getRoutes, Route, Tag } from "@/utils/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

export default function MobileSideBar({ lang }: { lang: LanguageCode }) {
	const [user] = useAuthUser()

	const routes = getRoutes(user)
	const isVisible = (route: Route) => !route.tags.includes(Tag.Hidden)
		&& route.tags.includes(Tag.Mobile)
	const segments = useSelectedLayoutSegments()
	const pathParts = [...segments].filter(p => !p.includes('('))

	return <div
		className='w-full
		m-3
		flex md:hidden
		justify-center
		shrink-0
		fixed bottom-0'>
		<div className="bg-neutral-900
		shadow-md
		flex
		gap-3
		p-3 px-5
		rounded-3xl">
			{
				routes
					.filter(isVisible)
					.map(r => {
						const name = r.names[lang]
						const isActive = pathParts.length
							? pathParts[0] === r.path
							: r.path === ""
						return <Link
							key={r.id}
							href={r.path || "/"}
							className={`group flex flex-col items-center
							${isActive ? "opacity-100" : "opacity-80"}
							`}>
							<Image
								className={`select-none
								duration-75
								w-8
								group-active:scale-75
								${!isActive && "scale-75"}
								${r.iconRounded && "rounded-full"}
								`}
								src={r.icon}
								alt={name}
								width={200}
								height={200}
							/>
							<span className={`text-sm
							${isActive ? "opacity-80" : "opacity-70"}`}>{name}</span>
						</Link>
					})
			}
		</div>
	</div>

}