import { NextRequest } from "next/server"

import db from "../../db"
import { Error, Success, isValidLang } from "../../util"
import { CheatSheetBuilder } from "../defs"

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ cheatsheet_id: string }> }
) {
	// Params
	const searchParams = req.nextUrl.searchParams
	const lang = searchParams.get("lang")
	const { cheatsheet_id } = await params

	// Lang
	if (!lang) return Error("No lang given.")
	if (!isValidLang(lang)) return Error("Invalid language.")

	// Main
	const cheatSheet = await db.fetchCheatSheet(cheatsheet_id)
	if (!cheatSheet) return Error(`No cheat sheet found for ID "${cheatsheet_id}"`)

	// await sleep(5)
	return Success(cheatSheet.serialize(lang))
}

export type CheatSheetRouteResult = ReturnType<CheatSheetBuilder["serialize"]>
