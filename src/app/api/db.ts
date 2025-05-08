import path from "path"
import fs from "fs"
import { ExerciseBuilder, OptionBase } from "./defs"

type UnknownExercise = ExerciseBuilder<
	unknown[],
	{ [key: string]: unknown },
	{ [key: string]: OptionBase }
>
export class DB {
	public cache: Map<string, UnknownExercise>
	constructor() {
		this.cache = new Map<string, UnknownExercise>()
	}
	async fetchAll({ force }: { force: boolean } = { force: false }) {
		// if (!force && this.cache.size) return this.cache

		const totalPath = path.join(process.cwd(), "/src/app/api/db")
		const files = fs.readdirSync(totalPath)

		for (let file of files) {
			// Folder
			if (!file.includes(".")) continue
			// File
			await this.fetch(file)
		}
		return this.cache
	}
	async fetch(id: string) {
		delete require.cache[require.resolve("./db/" + id)]
		const module = await import("./db/" + id)
		const Exercise = module.default as UnknownExercise
		this.cache.set(Exercise.id, Exercise)
		console.log(`✅ Fetched ${id}`)
		return Exercise
	}
}

const db = new DB()
export default db
