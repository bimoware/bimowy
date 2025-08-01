import { getLanguage, LocaleRecord, toLocaleString } from "@/lib/locale"
import { Metadata } from "next";

export type MetadataGenerationProps<T extends string[]> = {
	params: Promise<{
		[P in T[number]]: string
	}>;
};

export type Tag = "desktop" | "mobile" | "beta" | "meta";

export type Route = {
	tags: Tag[]
	path?: string
	icon: string
	favicon?: string
	iconFree?: boolean
	names: LocaleRecord
	descs?: LocaleRecord
}

export const ROUTES = {
	"home": {
		tags: ["desktop", "mobile"],
		favicon: '/favicon.ico',
		path: '/',
		icon: '/media/icon.png',
		iconFree: true,
		names: toLocaleString("Bimowy"),
		descs: {
			en: "Platform to freely explore math concepts with interactive tools & customizable exercises",
			fr: "Platforme pour librement explorer des concepts mathématiques avec des outils interactifs & des exercises customizables"
		}
	},
	"resources": {
		tags: ["desktop", "mobile"],
		icon: '/svgs/resource.svg',
		names: {
			en: "Resources",
			fr: "Ressources"
		},
		descs: {
			en: "List of all resources (tools & exercises) of the platform",
			fr: "Liste de toutes les resources (outils & exercises) de la platforme"
		}
	},
	"exercise": {
		tags: [],
		icon: '/svgs/exercise.svg',
		names: {
			en: 'Exercise',
			fr: 'Exercice'
		}
	},
	"tool": {
		tags: [],
		icon: '/svgs/tool.svg',
		names: { en: 'Tool', fr: "Outil" }
	},
	"test": {
		tags: [],
		icon: '/svgs/test.svg',
		names: toLocaleString('Test'),
	},
	"credits": {
		tags: ["desktop", "mobile", "meta"],
		icon: '/svgs/code.svg',
		names: toLocaleString('Credits'),
		descs: {
			en: "Credits for all platforms, users & tools used to create this project",
			fr: "Credits pour toutes les platformes, utilisateurs & outils pour créer ce projet"
		}
	},
	"page-not-found": {
		tags: [],
		icon: '/svgs/report.svg',
		iconFree: false,
		names: {
			en: 'Page not found',
			fr: 'Page introuvable'
		}
	}
} as const satisfies Record<string, Route>

type RouteID = keyof typeof ROUTES

export function getRoute(id: RouteID): Route & { id: RouteID } {
	const route = ROUTES[id];
	return { ...route, id };
}
export function getRoutes() {
	return (Object.keys(ROUTES) as RouteID[]).map(getRoute)
}


export async function generateMetadataUtil(
	id: RouteID,
	customTitle?: string
): Promise<Metadata> {
	const routeData = getRoute(id)
	const locale = await getLanguage()
	return {
		title: customTitle ?? routeData.names[locale],
		icons: {
			icon: "favicon" in routeData ? routeData.favicon : routeData.icon,
		},
		description: routeData.descs?.[locale],
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
