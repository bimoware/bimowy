import { NextRequest } from "next/server"

import db from "../../db"
import { Error, Success, isValidLang, sleep } from "../../util"
import { CheatSheetBuilder } from "../defs"

export async function GET(req: NextRequest) {
	// Params
	const searchParams = req.nextUrl.searchParams
	const lang = searchParams.get("lang")

	// Lang
	if (!lang) return Error("No lang given.")
	if (!isValidLang(lang)) return Error("Invalid language.")

	// Main
	const cache = await db.fetchAllCheatSheets()
	const values = Array.from(cache.values()).map((ex) => ex.serialize(lang))
	// await sleep(5)
	return Success(values)
}

export type CheatSheetAllRouteResult = ReturnType<
	CheatSheetBuilder["serialize"]
>[]
