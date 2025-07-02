import { NextRequest } from "next/server"
import {
	ExerciseBuilder
} from "@/lib/resources"
import {
	DEFAULT_N_QUESTIONS_ID,
	DEFAULT_N_QUESTIONS_OPTION, UserOptions
} from "@/lib/resources"
import { NextError, NextSuccess } from "@api/routing"
import { isValidLang } from "@/lib/locale"
import { resourcesManager } from "@/server/resourcesManager"

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	// Params
	const searchParams = req.nextUrl.searchParams

	// ExerciseId
	const { id: exerciseId } = await params
	if (!exerciseId) throw NextError("No ID provided.")
	const exercise = await resourcesManager.fetch(exerciseId)! as ExerciseBuilder

	// language
	const lang = searchParams.get("lang")
	if (!lang) throw NextError("No lang provided")
	if (!isValidLang(lang)) throw NextError("Invalid lang")

	// Options
	const options: UserOptions = await req.json()

	// Problems
	const problem = exercise.validateOptions(options)
	if (problem) return NextError(problem[lang])

	// Main
	const exercises = Array.from({
		length:
			options[DEFAULT_N_QUESTIONS_ID] ||
			DEFAULT_N_QUESTIONS_OPTION.config.defaultValue
	}).map(() => exercise.generate(options, lang))

	return NextSuccess(exercises)
}

export type ExercisesGenerateRouteResult = ReturnType<ExerciseBuilder["generate"]>[]
