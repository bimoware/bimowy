import { getTranslations } from "next-intl/server";
import { getLanguage } from "@/utils/locale";
import { resourceHandler } from '@api/main'
import { generateMetadataUtil } from "@/utils/sidebar";
import ResourceList from "./cpn/ResourceList";


export async function generateMetadata() {
	return await generateMetadataUtil('resources')
}
export default async function ResourcesPage() {
	const t = await getTranslations('ResourcesPage')
	const lang = await getLanguage()
	const resources = (await resourceHandler.fetchAll())
		.map(r => r.serialize(lang))

	return <div>
		<h1>{t('title')}</h1>
		<ResourceList {...{ resources }} />
	</div>
}

