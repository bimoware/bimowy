import ressources from "@api/ressources/main";
import { Language } from "@api/main";
import { getLocale } from "next-intl/server";
import ExerciseClientPage from "./cpn/ClientPage";
import { generateMetadataUtil, MetadataGenerationProps } from "@util/sidebar";

type Params = MetadataGenerationProps<["exercise_id"]>
export async function generateMetadata({ params }: Params) {
	const { locale, exercise } = await fetchData({ params })
	if (exercise) return await generateMetadataUtil('sandbox', exercise.serialize(locale).name);
}

export default async function ExercisePage({
	params,
}: Params) {
	const { locale, exercise_id, exercise } = await fetchData({ params })
	const exerciseData = exercise.serialize(locale)
	return <ExerciseClientPage {...{ exerciseData, exercise_id, locale }} />
}


async function fetchData({ params }: Params) {
	const locale = await getLocale() as Language
	const { exercise_id } = await params;
	const exercise = await ressources.fetchExercise(exercise_id)
	return { locale, exercise_id, exercise }
}