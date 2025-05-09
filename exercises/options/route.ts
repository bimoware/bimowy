import { NextRequest } from "next/server"

import db from "../../db"
import { Error, Success } from "../../util"
import { ExerciseBuilder } from "../defs"

export async function GET(req: NextRequest) {
	// Params
	const searchParams = req.nextUrl.searchParams

	const exerciseId = searchParams.get("id")
	const lang = searchParams.get("lang")

	// Errors
	if (!exerciseId) return Error("No ID provided.")
	if (!lang) return Error("No lang provided.")
	if (lang != "en" && lang != "fr") return Error("Invalid language.")

	const exercise = await db.fetchExercise(exerciseId)
	if (!exercise) return Error(`No exercise found for id '${exerciseId}'`)

	// Main
	const exerciseData = exercise.serialize(lang)

	return Success({
		name: exerciseData.name,
		options: exerciseData.options
	})
}

export type ExercisesOptionsRouteResult = ReturnType<ExerciseBuilder["serialize"]>
