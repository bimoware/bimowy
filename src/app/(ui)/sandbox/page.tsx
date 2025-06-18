import { Card, CardLister } from "@/cpn/Card";
import { getLocale, getTranslations } from "next-intl/server";
import { Language } from "@api/main";
import db from '@api/ressources/main'
import { ExerciseBuilder } from "@api/ressources/exercises/defs";
import { generateMetadataUtil } from "@util/sidebar";


export async function generateMetadata() {
	return await generateMetadataUtil('sandbox')
}
export default async function SandboxPage() {
	const t = await getTranslations('SandboxPage')
	const lang = (await getLocale()) as Language
	const fetchedExercises = (await db.fetchAllExercises())
	const exercises = Array.from(fetchedExercises.values())
		.map(v => v.serialize(lang))

	return <CardLister title={t('sandbox')} >
		<ExerciseList {...{ exercises }} />
	</CardLister>
}

function ExerciseList({ exercises }: { exercises: ReturnType<ExerciseBuilder["serialize"]>[] }) {
	return exercises.map(exercise => <Card
		{...exercise}
		href={"/sandbox/" + exercise.id}
		key={exercise.id}
	/>)
}