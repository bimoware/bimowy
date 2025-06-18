import { Language, LocaleStringRecord } from "@api/main"
import { User } from "@supabase/supabase-js";
import { getLocale } from "next-intl/server"

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
	icon: string | { src: string, rounded: boolean },
	nameLocalizations: string | LocaleStringRecord
}
export type Route = {
	tags: Tag[]
	id: string
	path: string
	icon: { src: string, rounded: boolean }
	nameLocalizations: LocaleStringRecord
}

export function getRoutes(user?: User) {
	return [
		{
			tags: [Tag.Mobile],
			id: 'home',
			path: '',
			icon: '/svgs/home.svg',
			nameLocalizations: {
				en: 'Home',
				fr: 'Acceuil'
			}
		},
		{
			tags: [Tag.Mobile],
			id: 'sandbox',
			icon: '/svgs/sandbox.svg',
			nameLocalizations: {
				en: 'Sandbox',
				fr: 'Bac à sable'
			}
		},
		{
			tags: [Tag.Mobile],
			id: "cheatsheets",
			icon: '/svgs/cheatsheet.svg',
			nameLocalizations: {
				en: 'Cheat Sheets',
				fr: 'Aides Mémoire'
			}
		},
		{
			tags: [Tag.Beta],
			id: "progress",
			icon: '/svgs/progress.svg',
			nameLocalizations: {
				en: 'Progress',
				fr: 'Progrès'
			}
		},
		{
			tags: [Tag.Beta],
			id: "psychology",
			icon: '/svgs/psychology.svg',
			nameLocalizations: {
				en: 'Psychology',
				fr: 'Psychologie'
			}
		},
		{
			tags: [Tag.Hidden, Tag.Meta],
			id: 'test',
			icon: '/svgs/test.svg',
			nameLocalizations: 'Test'
		},
		{
			tags: [Tag.Meta, Tag.Mobile],
			id: 'credits',
			icon: '/svgs/code.svg',
			nameLocalizations: 'Credits'
		},
		{
			tags: [Tag.Meta, Tag.Hidden],
			id: 'page-not-found',
			icon: '/svgs/report.svg',
			nameLocalizations: {
				en: 'Page not found',
				fr: 'Page introuvable'
			}
		},
		user
			? {
				tags: [Tag.Meta, Tag.Mobile],
				id: 'user',
				icon: { src: user.user_metadata.avatar_url, rounded: true },
				path: "user/" + user.user_metadata.user_name,
				nameLocalizations: user.user_metadata.user_name
			}
			: {
				tags: [Tag.Meta, Tag.Mobile],
				id: 'login',
				icon: '/svgs/login.svg',
				nameLocalizations: {
					en: 'Login',
					fr: 'Se connecter'
				}
			}

	].map(fixRawRoute)
}

export function fixRawRoute(route: RawRoute) {
	return {
		...route,
		tags: route.tags || [],
		path: route.path ?? route.id,
		icon: typeof route.icon == "string"
			? { src: route.icon, rounded: false }
			: route.icon,
		nameLocalizations: typeof route.nameLocalizations != "string"
			? route.nameLocalizations
			: {
				en: route.nameLocalizations,
				fr: route.nameLocalizations
			}
	}
}

export function getRoute(id: Route["id"], routes?: ReturnType<typeof getRoutes>) {
	return (routes || getRoutes()).find(r => r.id == id)!
}

export async function generateMetadataUtil(
	id: Route["id"],
	customTitle?: string
) {
	const routeData = getRoute(id)
	const locale = await getLocale() as Language
	return {
		title: customTitle ?? routeData.nameLocalizations[locale],
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
