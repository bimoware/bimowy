import { NextRequest } from "next/server"

import { UserOption } from "@app/exercises/[exercise_id]/page"

import db from "../db"
import { ContextSection } from "../defs"
import { Error, Success, isValidLang } from "../util"

export async function GET(req: NextRequest) {
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
	let paramOptions = searchParams.get("options")!
	let options = [] as UserOption[]
	if (paramOptions) {
		options = JSON.parse(decodeURIComponent(paramOptions)) as UserOption[]
	}

	// Main
	const exercises = Array.from({
		length: options.find((o) => o.id == "n")?.value || 5,
	}).map(() => exercise.generate(lang, options))

	return Success(exercises)
}

export type GenerateRouteResult = {
	exercise_id: string
	seed: number[]
	context: ContextSection[]
}[]
