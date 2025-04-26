import { UserOption } from "@app/exercises/[exercise_id]/page"
import fs from "fs"
import path from "path"

export type ExerciseTags =
	| "basic-arithmetic"
	| "geometry"
	| "trigonometry"
	| "algebra"
	| "linear-algebra"
	| "calculus"
	| "statistics"
	| "probability"
	| "multivariable-calculus"

export const LanguageCodes = ["fr", "en"] as const
export type Language = (typeof LanguageCodes)[number]
type LocaleStrings = {
	[K in Language]?: string
}

export type ContextElement =
	| {
			type: "text"
			text: string
			extra?: ("mono" | "latex")[]
	  }
	| { type: "input"; id: string }

export type ContextSection = {
	type: "p"
	content: ContextElement[]
}

export type GeneratedExercise = {
	exercise_id: string
	seed: number[]
	context: ContextSection[]
}

export type _BaseOption = { id: string } & (
	| {
			type: "number"
			min?: number
			max?: number
			defaultValue: number
	  }
	| {
			type: "boolean"
			defaultValue: boolean
	  }
)
export type APIOption = _BaseOption & { title: string }
export type RawOption = _BaseOption & { title: LocaleStrings | string }

type Corrections<Answers> = {
	[K in keyof Answers]: boolean
}

export class ExerciseGenerator<Seed, Answers> {
	public id: string
	public rawData: any
	public nameLocales: LocaleStrings
	public descLocales: LocaleStrings
	public tags: ExerciseTags[]
	public createdOn: number
	public beta: boolean
	public options: RawOption[]
	public validateAnswers: (seed: Seed, answers: Answers) => Corrections<Answers>
	public generateSeed: (options: UserOption[]) => Seed
	public getContext: (seed: Seed, lang: Language) => ContextSection[]
	public getSolution: (seed: Seed) => Answers
	public getDetailedSolution: (seed: Seed) => ContextSection[]

	constructor(data: {
		id: string
		nameLocales?: LocaleStrings | string
		descLocales?: LocaleStrings | string
		tags: ExerciseTags[]
		createdOn: number
		options?: RawOption[]
		beta?: boolean
		validateAnswers: (seed: Seed, answers: Answers) => Corrections<Answers>
		generateSeed: (options: UserOption[]) => Seed
		getContext: (seed: Seed, lang: Language) => ContextSection[]
		getSolution: (seed: Seed) => Answers
		getDetailedSolution: (seed: Seed) => ContextSection[]
	}) {
		this.rawData = data
		this.id = data.id
		if (!data.nameLocales) {
			const name = this.id[0].toUpperCase() + this.id.slice(1)
			this.nameLocales = { en: name, fr: name }
		} else if (typeof data.nameLocales == "string") {
			this.nameLocales = {
				en: data.nameLocales,
				fr: data.nameLocales,
			}
		} else {
			this.nameLocales = data.nameLocales
		}
		if (!data.descLocales) {
			this.descLocales = { en: undefined, fr: undefined }
		} else if (typeof data.descLocales == "string") {
			this.descLocales = {
				en: data.descLocales,
				fr: data.descLocales,
			}
		} else {
			this.descLocales = data.descLocales
		}
		this.tags = data.tags ?? []
		this.createdOn = data.createdOn
		this.beta = data.beta ?? false
		this.options = data.options || []
		this.options.push({
			title: { en: "Number of questions", fr: "Nombre de questions" },
			id: "_n",
			type: "number",
			min: 1,
			max: 15,
			defaultValue: 5,
		})
		this.validateAnswers = data.validateAnswers
		this.generateSeed = data.generateSeed
		this.getContext = data.getContext
		this.getSolution = data.getSolution
		this.getDetailedSolution = data.getDetailedSolution
	}
	get recent() {
		return this.createdOn >= 5
	}
	serialize(lang: Language) {
		return {
			id: this.id,
			name: this.nameLocales[lang],
			desc: this.descLocales[lang],
			tags: this.tags,
			recent: this.recent,
			beta: this.beta,
			options: (this.options ?? []).map((o) => {
				o.title = typeof o.title == "string" ? o.title : o.title[lang]!
				return o
			}),
		}
	}

	generate(lang: Language, options: UserOption[]) {
		const seed = this.generateSeed(options)
		const context = this.getContext(seed, lang)
		return {
			exercise_id: this.id,
			seed,
			context,
		}
	}
}

type UnknownExerciseGenerator = ExerciseGenerator<unknown, unknown>
type ExerciseGeneratorCreator = (
	id: string
) => ExerciseGenerator<unknown, unknown>
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
