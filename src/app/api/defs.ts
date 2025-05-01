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

export type _NumberOptionDef = {
	type: "number"
	defaultValue: number
	min?: number
	max?: number
}

export type _BooleanOptionDef = {
	type: "boolean"
	defaultValue: boolean
}

export type APIOption = {
	id: string
	title: string
} & (_NumberOptionDef | _BooleanOptionDef)

export type RawOption = {
	id: string
	title: string | LocaleStrings
} & (_NumberOptionDef | _BooleanOptionDef)

type Corrections<Answers> = {
	[K in keyof Answers]: boolean
}

export type UserAnswers = {
	[key: string]: any
}
export type UserOptions = {
	[key: string]: any
}

export type OptionDefs = Record<string, RawOption>
export type OptionValuesFrom<T extends OptionDefs> = {
	[K in keyof T]: T[K] extends { type: "number" } ? number : boolean
}

export class ExerciseGenerator<
	Seed extends any[],
	Answers extends Record<string,any>,
	Options extends OptionValuesFrom<OptionDefs>
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
	public generateSeed: (options: Options) => Seed
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
		generateSeed: (options: Options) => Seed
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
		console.log(data.optionDefs)
		this.optionDefs = data.optionDefs
		this.options = Object.entries(data.optionDefs).map(([id, def]) => ({
			...def,
			id
		}))
		this.options.push({
			title: { en: "Number of questions", fr: "Nombre de questions" },
			id: "_n",
			type: "number",
			min: 1,
			max: 15,
			defaultValue: 5
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
			})
		}
	}
	getOptionValue(id: string, options: Options) {
		return options[id]
	}
	generate(lang: Language, options: Options) {
		const seed = this.generateSeed(options)
		const context = this.getContext(seed, lang)
		return {
			exercise_id: this.id,
			seed,
			context
		}
	}
}
