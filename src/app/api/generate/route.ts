import { NextRequest } from "next/server"
import db from "../db"
import { DEFAULT_N_QUESTIONS_ID, DEFAULT_N_QUESTIONS_OPTION, ExerciseBuilder, UserOptions } from "../defs"
import { Error, Success, isValidLang } from "../util"

export async function POST(req: NextRequest) {
	// Params
	const searchParams = req.nextUrl.searchParams

	// ExerciseId
	const exerciseId = searchParams.get("id")
	if (!exerciseId) throw Error("No ID provided.")
	const exercise = (await db.fetch(exerciseId))!

	// language
	const lang = searchParams.get("lang")
	if (!lang) throw Error("No lang provided")
	if (!isValidLang(lang)) throw Error("Invalid lang")

	// Options
	let options: UserOptions = await req.json()

	// Problems
	// if (exercise.extraValidateOptions) {
	// 	const problems = exercise.extraValidateOptions(options)
	// 	if (problems) return Error(problems)
	// }
	// Main
	const exercises = Array.from({
		length: options[DEFAULT_N_QUESTIONS_ID] || DEFAULT_N_QUESTIONS_OPTION.config.defaultValue
	}).map(() => exercise.generate(options, lang))

	return Success(exercises)
}

export type GenerateRouteResult = ReturnType<ExerciseBuilder["generate"]>[]
