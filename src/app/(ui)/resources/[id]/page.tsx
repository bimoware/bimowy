import { ResourceType } from "@/lib/resources"
import { getLanguage } from "@/lib/locale"
import { generateMetadataUtil } from "@cpn/sidebars/main"
import ExercisePage from "./cpn/exercise/ExercisePage"
import { ExerciseBuilder } from "@/lib/resources/"
import { NoteBuilder } from "@/lib/resources"
import NotePage from "./cpn/note/NotePage"
import { CourseBuilder } from "@/lib/resources"
import CoursePage from "./cpn/course/CoursePage"
import { resourcesManager } from "@/server/resourcesManager";

export async function generateMetadata({ params }: {
	params: Promise<{ id: string }>
}) {
	const lang = await getLanguage()
	const { id } = await params
	const resource = await resourcesManager.fetch(id)
	return await generateMetadataUtil(resource.type, resource.names[lang])
}

export default async function ResourcePage({ params }: {
	params: Promise<{ id: string }>
}) {
	const locale = await getLanguage()
	const { id } = await params
	const resource = await resourcesManager.fetch(id)
	switch (resource.type) {
		case ResourceType.Exercise:
			const exerciseData = resource.serialize(locale) as ReturnType<ExerciseBuilder["serialize"]>
			return <ExercisePage {...{ exerciseData, exercise_id: id, locale }} />
		case ResourceType.Note:
			const note = resource.serialize(locale) as ReturnType<NoteBuilder["serialize"]>
			return <NotePage {...note} {...{ locale }} />
		case ResourceType.Course:
			const course = resource.serialize(locale) as ReturnType<CourseBuilder["serialize"]>
			return <CoursePage {...course} {...{ locale }} />
	}
	return <>Resource type not supported yet</>
}