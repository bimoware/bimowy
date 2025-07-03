import { LanguageCode, LocaleRecord, toLocaleString } from "@/lib/locale"
import { User } from "@supabase/supabase-js";
import { Metadata } from "next";
import { getLocale } from "next-intl/server"

export type MetadataGenerationProps<T extends string[]> = {
	params: Promise<{
		[P in T[number]]: string
	}>;
};

export enum Tag {
	Desktop = "desktop",
	Mobile = "mobile",
	Beta = "beta",
	Meta = "meta"
}

type RawRoute = {
	tags?: Tag[],
	favicon?: string
	id: string,
	path?: string,
	icon: string,
	iconRounded?: boolean,
	names: string | LocaleRecord
}

export type Route = {
	tags: Tag[]
	id: string
	path: string
	icon: string
	favicon?: string
	iconRounded: boolean
	names: LocaleRecord
}

export function getRoutes(user?: User) {
	const routes: RawRoute[] = [
		{
			tags: [Tag.Desktop, Tag.Mobile],
			id: 'home',
			favicon: '/favicon.ico',
			path: '',
			icon: '/svgs/home.svg',
			names: {
				en: 'Home',
				fr: 'Acceuil'
			}
		},
		{
			tags: [Tag.Desktop, Tag.Mobile],
			id: 'resources',
			icon: '/svgs/resource.svg',
			names: {
				en: "Resources",
				fr: "Ressources"
			}
		},
		{
			tags: [],
			id: 'exercise',
			icon: '/svgs/lab.svg',
			names: {
				en: 'Exercise',
				fr: 'Exercice'
			}
		},
		{
			tags: [],
			id: "note",
			icon: '/svgs/note.svg',
			names: 'Notes'
		},
		{
			tags: [],
			id: "course",
			icon: '/svgs/course.svg',
			names: { en: 'Course', fr: "Cours" }
		},
		{
			tags: [],
			id: 'test',
			icon: '/svgs/test.svg',
			names: 'Test'
		},
		{
			tags: [Tag.Desktop, Tag.Mobile, Tag.Meta],
			id: 'credits',
			icon: '/svgs/code.svg',
			names: 'Credits'
		},
		{
			tags: [],
			id: 'page-not-found',
			icon: '/svgs/report.svg',
			names: {
				en: 'Page not found',
				fr: 'Page introuvable'
			}
		},
		{
			tags: [Tag.Meta, Tag.Mobile, Tag.Desktop],
			...(user
				? {
					id: 'user',
					icon: user.user_metadata.avatar_url,
					path: "user/" + user.user_metadata.user_name,
					names: user.user_metadata.user_name,
					iconRounded: true
				}
				: {
					id: 'login',
					icon: '/svgs/login.svg',
					iconRounded: true,
					names: {
						en: 'Login',
						fr: 'Connexion'
					}
				})
		}
	]
	return routes.map(fixRawRoute)
}

export function fixRawRoute(route: RawRoute) {
	return {
		...route,
		tags: route.tags || [],
		path: route.path ?? route.id,
		icon: route.icon,
		iconRounded: route.iconRounded ?? false,
		names: toLocaleString(route.names)
	}
}

export function getRoute(id: Route["id"]) {
	return getRoutes().find(r => r.id == id)!
}

export async function generateMetadataUtil(
	id: Route["id"],
	customTitle?: string
): Promise<Metadata> {
	const routeData = getRoute(id)
	return {
		title: customTitle ?? routeData.names[await getLocale() as LanguageCode],
		icons: routeData.favicon ?? routeData.icon,
		applicationName: "Bimowy",
		twitter: {
			card: "summary"
		}
	}
}

export function split<T>(L: T[], condition: (elem: T) => boolean) {
	return L.reduce((prev, curr) => {
		prev[condition(curr) ? 0 : 1].push(curr)
		return prev;
	}, [
		[], []
	] as T[][])
}
