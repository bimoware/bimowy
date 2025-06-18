import path from "path"
import fs from "fs"
import { ExerciseBuilder } from "./exercises/defs"
import { CheatSheetBuilder } from "./cheatsheets/defs"

export class RessourcesHandler {
	public caches = {
		exercises: new Map<string, ExerciseBuilder>(),
		cheatSheets: new Map<string, CheatSheetBuilder>()
	}
	constructor() { }
	async fetchAllCheatSheets() {
		const totalPath = path.join(process.cwd(), "/src/app/api/ressources/cheatsheets/data/")
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
		const possibleCheatSheet = this.caches.cheatSheets.get(id)
		if (possibleCheatSheet) return possibleCheatSheet
		const module = await import("./cheatsheets/data/" + id)
		const CheatSheet = module.default as CheatSheetBuilder
		this.caches.cheatSheets.set(CheatSheet.id, CheatSheet)
		console.log(`✅ Fetched cheat sheet ${id}`)
		return CheatSheet
	}

	async fetchAllExercises() {
		const totalPath = path.join(process.cwd(), "/src/app/api/ressources/exercises/data/")
		const files = fs.readdirSync(totalPath)

		for (let file of files) {
			await this.fetchExercise(file)
		}
		return this.caches.exercises
	}
	async fetchExercise(id: string) {
		const possibleExercise = this.caches.exercises.get(id)
		if (possibleExercise) return possibleExercise
		const module = await import("./exercises/data/" + id)
		const Exercise = module.default as ExerciseBuilder
		this.caches.exercises.set(Exercise.id, Exercise)
		console.log(`✅ Fetched exercise ${id}`)
		return Exercise
	}
}

const ressources = new RessourcesHandler()
export default ressources
