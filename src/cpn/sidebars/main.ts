import { LanguageCode, LocaleRecord, toLocaleString } from "@/lib/locale"
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
	iconFree?: boolean,
	isRounded?: boolean,
	names: string | LocaleRecord
}

export type Route = {
	tags: Tag[]
	id: string
	path: string
	icon: string
	favicon?: string
	isRounded: boolean,
	iconFree: boolean
	names: LocaleRecord
}

export const DEFAULT_ROUTES: Route[] = [
	{
		tags: [Tag.Desktop, Tag.Mobile],
		id: 'home',
		favicon: '/favicon.ico',
		path: '',
		icon: '/media/icon.png',
		iconFree: true,
		names: "Bimowy"
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
		id: "tool",
		icon: '/svgs/tool.svg',
		names: { en: 'Tool', fr: "Outil"}
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
	}
].map(fixRawRoute)

export function getRoutes() {
	return DEFAULT_ROUTES
}

export function fixRawRoute(route: RawRoute) {
	return {
		...route,
		tags: route.tags || [],
		path: route.path ?? route.id,
		icon: route.icon,
		iconFree: route.iconFree ?? false,
		names: toLocaleString(route.names),
		isRounded: route.isRounded ?? false
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
		icons: {
			icon: routeData.favicon ?? routeData.icon,
		},
		applicationName: "Bimowy",
		twitter: {
			card: "summary_large_image",
			images: ["/media/banner.png"]
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
