import { NextRequest } from "next/server"

import db from "../../db"
import { Error, Success, isValidLang } from "../../util"
import { ExercisesOptionsRouteResult } from "../[exercise_id]/route"

// Example: /api/exercises?lang=fr
export async function GET(req: NextRequest) {
	// Params
	const searchParams = req.nextUrl.searchParams
	const lang = searchParams.get("lang")

	// Lang
	if (!lang) return Error("No lang given.")
	if (!isValidLang(lang)) return Error("Invalid language.")

	// Main
	const cache = await db.fetchAllExercises()
	const values = Array.from(cache.values()).map((ex) => ex.serialize(lang))
	return Success(values)
}

export type ExercisesAllRouteResult = ExercisesOptionsRouteResult[]
