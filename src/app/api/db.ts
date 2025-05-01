import path from "path"
import fs from "fs"
import { UserAnswers, UserOptions, ExerciseGenerator } from "./defs"

type UnknownExerciseGenerator = ExerciseGenerator<
	unknown[],
	UserAnswers,
	UserOptions
>
type ExerciseGeneratorCreator = (
	id: string
) => ExerciseGenerator<unknown[], UserAnswers, UserOptions>
export class DB {
	public cache: Map<string, UnknownExerciseGenerator>
	constructor() {
		this.cache = new Map<string, UnknownExerciseGenerator>()
	}
	async fetchAll({ force }: { force: boolean } = { force: false }) {
		// if (!force && this.cache.size) return this.cache 

		const totalPath = path.join(process.cwd(), "/src/app/api/db")
		const files = fs.readdirSync(totalPath)

		for (let file of files) {
			if (!file.includes(".")) continue
			const id = file.split(".")[0]
			const module = await import("./db/" + file)
			const getExercise = module.default as ExerciseGeneratorCreator
			this.cache.set(id, getExercise(id))
			console.log(`✅ Fetched ${id}`)
		}
		return this.cache
	}
	async fetch(id: string) {
		if (!this.cache.size) await this.fetchAll()
		return this.cache.get(id)
	}
}

const db = new DB()
export default db
