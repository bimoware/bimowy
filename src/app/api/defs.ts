import { DEFAULT_OPTION } from "./util"

// Exercise Tags
export type ExerciseTags =
	| "arithmetic"
	| "geometry"
	| "trigonometry"
	| "algebra"
	| "linear-algebra"
	| "calculus"
	| "statistics"
	| "probability"
	| "multivariable-calculus"

// Language
export const LanguageCodes = ["fr", "en"] as const
export type Language = (typeof LanguageCodes)[number]
type LocaleStrings = {
	[K in Language]?: string
}

// Context
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

// General
export type GeneratedExercise = {
	exercise_id: string
	seed: number[]
	context: ContextSection[]
}

// Options
export type _NumberOptionRawData = {
	type: "number"
	defaultValue: number
	min?: number
	max?: number
}

export type _BooleanOptionRawData = {
	type: "boolean"
	defaultValue: boolean
}

export type _RangeOptionRawData = {
	type: "range"
	defaultValue: [number, number]
	min?: number
	max?: number
}

export type _OptionRawData =
	| _NumberOptionRawData
	| _BooleanOptionRawData
	| _RangeOptionRawData
export type APIOption = {
	id: string
	title: string
} & _OptionRawData
export type RawOption = {
	id: string
	title: string | LocaleStrings
} & _OptionRawData

export type OptionDefs = Record<string, RawOption>
export type OptionValuesFrom<T extends OptionDefs> = {
	[K in keyof T]: T[K] extends { type: "number" }
		? number
		: T[K] extends { type: "range" }
			? [number, number]
			: boolean
}

// Correction
type Corrections<Answers> = {
	[K in keyof Answers]: boolean
}
export type UserAnswers = {
	[key: string]: any
}

export class ExerciseGenerator<
	Seed extends any[],
	Answers extends Record<string, any>,
	UserOptions extends OptionValuesFrom<OptionDefs>
> {
	public id: string
	public rawData: any
	public nameLocales: LocaleStrings
	public descLocales: LocaleStrings
	public tags: ExerciseTags[]
	public createdOn: number
	public beta: boolean
	public options: RawOption[]
	public optionDefs: OptionDefs
	public validateAnswers: (seed: Seed, answers: Answers) => Corrections<Answers>
	public generateSeed: (options: UserOptions) => Seed
	public getContext: (seed: Seed, lang: Language) => ContextSection[]
	public getSolution: (seed: Seed) => Answers
	public getDetailedSolution: (seed: Seed) => ContextSection[]

	constructor(data: {
		id: string
		nameLocales?: LocaleStrings | string
		descLocales?: LocaleStrings | string
		tags?: ExerciseTags[]
		createdOn: number
		optionDefs: OptionDefs
		beta?: boolean
		validateAnswers: (seed: Seed, answers: Answers) => Corrections<Answers>
		generateSeed: (options: UserOptions) => Seed
		getContext: (seed: Seed, lang: Language) => ContextSection[]
		getSolution: (seed: Seed) => Answers
		getDetailedSolution?: (seed: Seed) => ContextSection[]
	}) {
		this.rawData = data
		this.id = data.id
		if (!data.nameLocales) {
			const name = this.id[0].toUpperCase() + this.id.slice(1)
			this.nameLocales = { en: name, fr: name }
		} else if (typeof data.nameLocales == "string") {
			this.nameLocales = {
				en: data.nameLocales,
				fr: data.nameLocales
			}
		} else {
			this.nameLocales = data.nameLocales
		}
		if (!data.descLocales) {
			this.descLocales = { en: undefined, fr: undefined }
		} else if (typeof data.descLocales == "string") {
			this.descLocales = {
				en: data.descLocales,
				fr: data.descLocales
			}
		} else {
			this.descLocales = data.descLocales
		}
		this.tags = data.tags ?? []
		this.createdOn = data.createdOn
		this.beta = data.beta ?? false

		// Options
		this.optionDefs = data.optionDefs
		this.options = Object.entries(data.optionDefs).map(([id, def]) => ({
			...def,
			id
		}))
		this.options.push(DEFAULT_OPTION)

		// Methods
		this.validateAnswers = data.validateAnswers
		this.generateSeed = data.generateSeed
		this.getContext = data.getContext
		this.getSolution = data.getSolution
		this.getDetailedSolution = data.getDetailedSolution || (() => [])
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
			})
		}
	}
	getOptionValue(id: string, options: UserOptions) {
		return options[id]
	}
	generate(lang: Language, options: UserOptions) {
		const seed = this.generateSeed(options)
		const context = this.getContext(seed, lang)
		return {
			exercise_id: this.id,
			seed,
			context
		}
	}
}
