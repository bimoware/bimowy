import { ResourceType } from "@api/lib/resource"
import { resourceHandler } from "@api/main"
import { getLanguage } from "@/utils/locale"
import { generateMetadataUtil } from "@cpn/sidebars/main"
import ExercisePage from "./cpn/exercise/ExercisePage"
import { ExerciseBuilder } from "@api/lib/exercise"
import { NoteBuilder } from "@api/lib/note"
import NotePage from "./cpn/note/NotePage"
import { CourseBuilder } from "@api/lib/course"
import CoursePage from "./cpn/course/CoursePage"

export async function generateMetadata({ params }: {
	params: Promise<{ id: string }>
}) {
	const lang = await getLanguage()
	const { id } = await params
	const resource = await resourceHandler.fetch(id)
	return await generateMetadataUtil(resource.type, resource.names[lang])
}

export default async function ResourcePage({ params }: {
	params: Promise<{ id: string }>
}) {
	const locale = await getLanguage()
	const { id } = await params
	const resource = await resourceHandler.fetch(id)
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