import { NextRequest } from "next/server"
import { resourceHandler } from "@api/main"
import {
	ExerciseBuilder
} from "@api/lib/exercise"
import {
	DEFAULT_N_QUESTIONS_ID,
	DEFAULT_N_QUESTIONS_OPTION, UserOptions
} from "@api/lib/option"
import { NextError, NextSuccess } from "@api/lib/routing"
import { isValidLang } from "@util/locale"

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	// Params
	const searchParams = req.nextUrl.searchParams

	// ExerciseId
	const { id: exerciseId } = await params
	if (!exerciseId) throw NextError("No ID provided.")
	const exercise = await resourceHandler.fetch(exerciseId)! as ExerciseBuilder

	// language
	const lang = searchParams.get("lang")
	if (!lang) throw NextError("No lang provided")
	if (!isValidLang(lang)) throw NextError("Invalid lang")

	// Options
	let options: UserOptions = await req.json()

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
