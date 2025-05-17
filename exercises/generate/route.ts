import { NextRequest } from "next/server"
import db from "../../db"
import {
	DEFAULT_N_QUESTIONS_ID,
	DEFAULT_N_QUESTIONS_OPTION,
	ExerciseBuilder,
	UserOptions
} from "../defs"
import { NextError, NextSuccess, isValidLang } from "../../util"

export async function POST(req: NextRequest) {
	// Params
	const searchParams = req.nextUrl.searchParams

	// ExerciseId
	const exerciseId = searchParams.get("id")
	if (!exerciseId) throw NextError("No ID provided.")
	const exercise = (await db.fetchExercise(exerciseId))!

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
