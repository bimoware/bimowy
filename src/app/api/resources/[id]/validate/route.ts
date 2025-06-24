import { NextRequest } from "next/server"
import { resourceHandler } from "@api/main"
import { NextError, NextSuccess } from "@api/lib/routing"
import { UserAnswers } from "@api/lib/option"
import { ExerciseBuilder } from "@api/lib/exercise"

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {

	// ID
	const { id: exerciseId } = await params
	if (!exerciseId) return NextError("No exerciseId")

	// Answers & Seed
	const { answers, seed }: { answers: UserAnswers; seed: any[] } =
		await req.json()
	if (!answers) return NextError("No answers given")
	if (typeof answers !== "object") return NextError("Answers must be an object")
	if (Array.isArray(answers)) return NextError("Answers must not be an array")

	// Main
	const exercise = await resourceHandler.fetch(exerciseId)
	if (!exercise) return NextError(`Resource with ID '${exerciseId}' not found`)
	if (!(exercise instanceof ExerciseBuilder)) return NextError(`Resource with ID '${exerciseId}' is not an exercise.`)
	const correction = exercise.validateAnswers(seed, answers)
	return NextSuccess(correction)
}

export type ExercisesValidateRouteResult = {
	[key: string]: boolean
}
