import { AnyExerciseBuilder, ResourceType } from "@/lib/resources"
import { getLanguage } from "@/lib/locale"
import { generateMetadataUtil } from "@cpn/sidebars/main"
import ExercisePage from "./cpn/exercise/ExercisePage"
import { resourcesManager } from "@/server/resourcesManager";

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
	const locale = await getLanguage()
	const { id } = await params
	const resource = await resourcesManager.fetch(id)
	switch (resource.type) {
		case ResourceType.Exercise:
			const exercise = resource.serialize(locale) as ReturnType<AnyExerciseBuilder["serialize"]>
			return <ExercisePage  {...{ exercise }} />
		default:
			return <>Resource type not supported yet</>
	}
}