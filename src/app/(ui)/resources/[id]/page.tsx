import { AnyExerciseBuilder, ResourceType } from "@/lib/resources"
import { getLanguage } from "@/lib/locale"
import { generateMetadataUtil } from "@cpn/sidebars/main"
import ExercisePage from "./cpn/exercise/ExercisePage"
import { resourcesManager } from "@/server/resourcesManager";
import ToolPage from "./cpn/tool/ToolPage";
import { AnyToolBuilder } from "@/lib/resources/builders/tool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: {
	params: Promise<{ id: string }>
}) {
	const locale = await getLanguage()
	const { id } = await params
	const resource = await resourcesManager.fetch(id)
	return await generateMetadataUtil(resource.type, resource.names[locale])
}

export default async function ResourcePage({ params }: {
	params: Promise<{ id: string }>
}) {
	const t = await getTranslations('ResourcePage')
	const locale = await getLanguage()
	const { id } = await params
	const resource = await resourcesManager.fetch(id)
	switch (resource.type) {
		case ResourceType.Exercise:
			const exercise = resource.serialize(locale) as ReturnType<AnyExerciseBuilder["serialize"]>
			return <ExercisePage  {...{ exercise, locale }} />
		case ResourceType.Tool:
			const tool = resource.serialize(locale) as ReturnType<AnyToolBuilder["serialize"]>
			return <ToolPage {...{ tool, locale }} />
		default:
			return <>{t('unknown-resource-type')}</>
	}
}