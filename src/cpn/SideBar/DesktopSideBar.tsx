"use client"
import { LanguageCode } from "@util/locale"
import { getRoutes, Route, split, Tag } from "@util/sidebar"
import DesktopSideBarIcon from "./DesktopSideBarIcon"
import { useAuthStateChange, useAuthUser } from "@/db/util"

export default function DesktopSideBar({ locale }: { locale: LanguageCode }) {
	const [user, setUser] = useAuthUser()

	const routes = getRoutes(user || undefined)
	const routeGroups = split(routes, (route) => !route.tags.includes(Tag.Meta))
	const isVisible = (route: Route) => !route.tags.includes(Tag.Hidden)

	useAuthStateChange(setUser)

	return <div className='h-full
	flex
	flex-col
	justify-between
	shrink-0
	gap-4'>
		{
			routeGroups
				.map((routeGroup, i) => <section key={i}
					className='bg-neutral-900
					p-1.5
					h-fit w-fit
					flex flex-col items-center
					shrink-0'>
					{
						routeGroup
							.filter(isVisible)
							.map(route => <DesktopSideBarIcon
								key={route.id}
								{...route}
								name={route.names[locale]}
							/>
							)
					}
				</section>)
		}
	</div>
}
