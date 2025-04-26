import { NextRequest } from "next/server"

import db from "../db"
import { APIOption, ExerciseTags } from "../defs"
import { Error, Success, isValidLang } from "../util"

// Example: /api/exercises?lang=fr
export async function GET(req: NextRequest) {
	// Params
	const searchParams = req.nextUrl.searchParams
	const lang = searchParams.get("lang")

	// Lang
	if (!lang) return Error("No lang given.")
	if (!isValidLang(lang)) return Error("Invalid language.")

	// Main
	const cache = await db.fetchAll()
	const values = Array.from(cache.values())
		.sort((a, b) => a.createdOn - b.createdOn)
		.map((ex) => ex.serialize(lang))
	return Success(values)
}

export type ExercisesRouteResult = {
	id: string
	name: string | null
	desc: string | null
	tags: ExerciseTags[]
	recent: boolean
	options: APIOption[]
}
