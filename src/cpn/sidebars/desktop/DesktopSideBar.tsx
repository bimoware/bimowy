"use client"
import { useLanguage } from "@/lib/locale"
import { getRoutes, Route, split } from "@cpn/sidebars/main"
import DesktopSideBarIcon from "./DesktopSideBarIcon"

export default function DesktopSideBar() {
	const lang = useLanguage()
	const isVisible = (route: Route) => route.tags.includes("desktop")
	const routeGroups = split(getRoutes(), route => !route.tags.includes("meta"))

	return <div className='h-screen
	p-3
	hidden sm:flex
	flex-col
	justify-between
	shrink-0
	gap-4
	fixed'>
		{
			routeGroups
				.map((routeGroup, i) => <section key={i}
					className='bg-black/15 dark:bg-white/5
					p-1.5
					h-fit w-fit
					flex flex-col items-center
					shrink-0'>
					{
						routeGroup
							.filter(isVisible)
							.map(route => {
								return <DesktopSideBarIcon key={route.id}
									{...route}
									name={route.names[lang]}
								/>
							})
					}
				</section>)
		}
	</div>
}
