import path from "path"
import fs from "fs"
import { UnknownExercise } from "./exercises/defs"
import { CheatSheetBuilder } from "./cheatsheets/defs"

export class DB {
	public caches = {
		exercises: new Map<string, UnknownExercise>(),
		cheatSheets: new Map<string, CheatSheetBuilder>()
	}
	constructor() { }
	async fetchAllCheatSheets() {
		const totalPath = path.join(process.cwd(), "/src/app/api/cheatsheets/db")
		const files = fs.readdirSync(totalPath)

		for (let file of files) {
			// Folder
			if (!file.includes(".")) continue
			// File
			await this.fetchCheatSheet(file)
		}
		return this.caches.cheatSheets
	}

	async fetchCheatSheet(id: string) {
		delete require.cache[require.resolve("./cheatsheets/db/" + id)]
		const module = await import("./cheatsheets/db/" + id)
		const CheatSheet = module.default as CheatSheetBuilder
		this.caches.cheatSheets.set(CheatSheet.id, CheatSheet)
		console.log(`✅ Fetched cheat sheet ${id}`)
		return CheatSheet
	}

	async fetchAllExercises() {
		const totalPath = path.join(process.cwd(), "/src/app/api/exercises/db")
		const files = fs.readdirSync(totalPath)

		for (let file of files) {
			// Folder
			if (!file.includes(".")) continue
			// File
			await this.fetchExercise(file)
		}
		return this.caches.exercises
	}
	async fetchExercise(id: string) {
		delete require.cache[require.resolve("./exercises/db/" + id)]
		const module = await import("./exercises/db/" + id)
		const Exercise = module.default as UnknownExercise
		this.caches.exercises.set(Exercise.id, Exercise)
		console.log(`✅ Fetched exercise ${id}`)
		return Exercise
	}
}

const db = new DB()
export default db
