import { NextRequest } from "next/server"

import db from "../../db"
import { Error, Success } from "../../util"
import { ExerciseBuilder } from "../defs"

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ exercise_id: string }> }
) {
	// Params
	const searchParams = req.nextUrl.searchParams
	const lang = searchParams.get("lang")
	const { exercise_id } = await params

	// Errors
	if (!exercise_id) return Error("No ID provided.")
	if (!lang) return Error("No lang provided.")
	if (lang != "en" && lang != "fr") return Error("Invalid language.")

	const exercise = await db.fetchExercise(exercise_id)
	if (!exercise) return Error(`No exercise found for id '${exercise_id}'`)

	// Main
	const exerciseData = exercise.serialize(lang)

	return Success({
		name: exerciseData.name,
		options: exerciseData.options
	})
}

export type ExerciseRouteResult = ReturnType<ExerciseBuilder["serialize"]>
