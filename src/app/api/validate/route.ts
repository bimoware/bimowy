import { NextRequest, NextResponse } from "next/server"

import db from "@app/api/db"

import { Error, Success } from "../util"
import { UserAnswers } from "../defs"

export async function POST(req: NextRequest) {
	// Params
	const searchParams = req.nextUrl.searchParams

	// ID
	const exerciseId = searchParams.get("id")
	if (!exerciseId) return Error("No exerciseId")

	// Answers & Seed
	const {
		answers,
		seed
	}: { answers: UserAnswers; seed: unknown[] } = await req.json()
	if (!answers) return Error("No answers given")
	if (typeof answers !== "object") return Error("Answers must be an object")
	if (Array.isArray(answers)) return Error("Answers must not be an array")

	// Main
	const exercise = await db.fetch(exerciseId)
	if (!exercise) return Error(`Exercise with ID '${exerciseId}' not found`)
	console.log({ answers, seed })
	const correction = exercise.validateAnswers(seed, answers)
	return Success(correction)
}

export type ValidateRouteResult = {
	[key: string]: boolean
}
