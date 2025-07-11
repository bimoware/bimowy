import { getTranslations } from "next-intl/server";
import { getLanguage } from "@/lib/locale";
import { generateMetadataUtil } from "@cpn/sidebars/main";
import ResourceList from "./cpn/ResourceList";
import { resourcesManager } from "@/server/resourcesManager";


export async function generateMetadata() {
	return await generateMetadataUtil('resources')
}
export default async function ResourcesPage() {
	const t = await getTranslations('ResourcesPage')
	const lang = await getLanguage()
	const resources = (await resourcesManager.fetchAll())
		.map(r => r.serialize(lang))

	return <div>
		<h1>{t('title')}</h1>
		<ResourceList {...{ resources }} />
	</div>
}

