import { NextRequest } from "next/server"
import db from "@app/api/db"
import { NextError, NextSuccess, isValidLang } from "../../util"
import { UserAnswers } from "../defs"

export async function POST(req: NextRequest) {
	// Params
	const searchParams = req.nextUrl.searchParams

	// ID
	const exerciseId = searchParams.get("id")
	if (!exerciseId) return NextError("No exerciseId")

	// Answers & Seed
	const { answers, seed }: { answers: UserAnswers; seed: unknown[] } =
		await req.json()
	if (!answers) return NextError("No answers given")
	if (typeof answers !== "object") return NextError("Answers must be an object")
	if (Array.isArray(answers)) return NextError("Answers must not be an array")

	// Main
	const exercise = await db.fetchExercise(exerciseId)
	if (!exercise) return NextError(`Exercise with ID '${exerciseId}' not found`)
	const correction = exercise.validateAnswers(seed, answers)
	return NextSuccess(correction)
}

export type ExercisesValidateRouteResult = {
	[key: string]: boolean
}
