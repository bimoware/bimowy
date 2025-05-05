import { NextRequest } from "next/server"

import db from "../db"
import { ContextSection } from "../defs"
import { DEFAULT_OPTION, Error, Success, isValidLang } from "../util"

export async function POST(req: NextRequest) {
	// Params
	const searchParams = req.nextUrl.searchParams

	// ExerciseId
	const exerciseId = searchParams.get("id")
	if (!exerciseId) return Error("No ID provided.")
	const exercise = (await db.fetch(exerciseId))!

	// language
	const lang = searchParams.get("lang")
	if (!lang) return Error("No lang provided")
	if (!isValidLang(lang)) return Error("Invalid lang")

	// Options
	let options: Record<string, any> = await req.json()
	// Main
	const exercises = Array.from({
		length: options[DEFAULT_OPTION.id] || DEFAULT_OPTION.defaultValue
	}).map(() => exercise.generate(lang, options))

	return Success(exercises)
}

export type GenerateRouteResult = {
	exercise_id: string
	seed: number[]
	context: ContextSection[]
}[]
