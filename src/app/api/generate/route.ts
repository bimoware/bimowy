import { NextRequest } from "next/server"

import { UserOption } from "@app/exercises/[exercise_id]/page"

import db from "../db"
import { ContextSection } from "../defs"
import { Error, Success, isValidLang } from "../util"

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
	let paramOptions: UserOption[] = await req.json().catch(console.error)

	let options: Record<string, any> = {}

	for (const userOption of paramOptions) {
		options[userOption.id] = userOption.value
	}

	for (const option of exercise.options) {
		if (!options[option.id]) options[option.id] = option.defaultValue
	}

	// Main
	const exercises = Array.from({
		length: options["_n"] || 5
	}).map(() => exercise.generate(lang, options))

	return Success(exercises)
}

export type GenerateRouteResult = {
	exercise_id: string
	seed: number[]
	context: ContextSection[]
}[]
