import { LanguageCode, LocaleRecord, toLocaleString } from "@util/locale"
import { User } from "@supabase/supabase-js";
import { getLocale } from "next-intl/server"
import { Metadata } from "next";

export type MetadataGenerationProps<T extends string[]> = {
	params: Promise<{
		[P in T[number]]: string
	}>;
};

export enum Tag {
	Hidden = "hidden",
	Beta = "beta",
	Meta = "meta",
	Mobile = "mobile"
}
type RawRoute = {
	tags?: Tag[],
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
	icon: string,
	iconRounded: boolean
	names: LocaleRecord
}

export function getRoutes(user?: User) {
	const routes: RawRoute[] = [
		{
			tags: [Tag.Mobile],
			id: 'home',
			path: '',
			icon: '/svgs/home.svg',
			names: {
				en: 'Home',
				fr: 'Acceuil'
			}
		},
		{
			tags: [Tag.Mobile],
			id: 'resources',
			icon: '/svgs/resource.svg',
			names: {
				en: "Resources",
				fr: "Ressources"
			}
		},
		{
			tags: [Tag.Mobile, Tag.Hidden],
			id: 'exercise',
			icon: '/svgs/lab.svg',
			names: {
				en: 'Exercise',
				fr: 'Exercice'
			}
		},
		{
			tags: [Tag.Mobile, Tag.Hidden],
			id: "note",
			icon: '/svgs/note.svg',
			names: 'Notes'
		},
		{
			tags: [Tag.Beta],
			id: "progress",
			icon: '/svgs/progress.svg',
			names: {
				en: 'Progress',
				fr: 'Progrès'
			}
		},
		{
			tags: [Tag.Beta, Tag.Hidden],
			id: "psychology",
			icon: '/svgs/psychology.svg',
			names: {
				en: 'Psychology',
				fr: 'Psychologie'
			}
		},
		{
			tags: [Tag.Hidden, Tag.Meta],
			id: 'test',
			icon: '/svgs/test.svg',
			names: 'Test'
		},
		{
			tags: [Tag.Meta, Tag.Mobile],
			id: 'credits',
			icon: '/svgs/code.svg',
			names: 'Credits'
		},
		{
			tags: [Tag.Meta, Tag.Hidden],
			id: 'page-not-found',
			icon: '/svgs/report.svg',
			names: {
				en: 'Page not found',
				fr: 'Page introuvable'
			}
		},
		user
			? {
				tags: [Tag.Meta, Tag.Mobile],
				id: 'user',
				icon: user.user_metadata.avatar_url,
				path: "user/" + user.user_metadata.user_name,
				names: user.user_metadata.user_name,
				iconRounded: true
			}
			: {
				tags: [Tag.Meta, Tag.Mobile],
				id: 'login',
				icon: '/svgs/login.svg',
				iconRounded: true,
				names: {
					en: 'Login',
					fr: 'Se connecter'
				}
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
) {
	const routeData = getRoute(id)
	return {
		title: customTitle ?? routeData.names[await getLocale() as LanguageCode],
		icons: routeData.icon
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
