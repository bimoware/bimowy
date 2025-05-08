import { ExportRouteResult } from "next/dist/export/types"

// Contexts
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
// Language
export const LanguageCodes = ["fr", "en"] as const
export type Language = (typeof LanguageCodes)[number]
type LocaleStringRecord = {
	[K in Language]: string
}

type LocaleString =
	| string
	| {
			[K in Language]: string
	  }

// Base Option
type BaseOptionConfig = {
	title: LocaleStringRecord
	defaultValue: unknown
}

export abstract class OptionBase<
	C extends BaseOptionConfig = BaseOptionConfig
> {
	constructor(public config: C) {}
}

// User
type ExtractDefaults<O extends Record<string, OptionBase>> = {
	[K in keyof O]: O[K]["config"]["defaultValue"]
}
type ExtractConfig<O extends Record<string, OptionBase>> = {
	[K in keyof O]: O[K]["config"]
}

export type UserOptions = Record<string, unknown> & { _n: number }
export type UserAnswers = Record<string, unknown>

enum OptionType {
	Number = 1,
	Radio = 2,
	Interval = 3
}
// Number
type NumberConfig = BaseOptionConfig & {
	defaultValue: number
	min?: number
	max?: number
}
export class NumberOption extends OptionBase<NumberConfig> {
	type = OptionType.Number
	constructor(public config: NumberConfig) {
		super(config)
	}
}

// Radio
type AllowedRadioOptionType = number | string
type RadioConfig<T> = BaseOptionConfig & {
	options: T[]
	defaultValue: T
}

export class RadioOption<T extends AllowedRadioOptionType> extends OptionBase<
	RadioConfig<T>
> {
	type = OptionType.Radio
	constructor(public config: RadioConfig<T>) {
		super(config)
	}
}

// Radio
type IntervalConfig = BaseOptionConfig & {
	defaultValue: [number, number]
}

export class IntervalOption extends OptionBase<IntervalConfig> {
	type = OptionType.Interval
	constructor(public config: IntervalConfig) {
		super(config)
	}
}

// ..

export type APIOption = (NumberOption | RadioOption<any> | IntervalOption)["config"]

// ExerciseBuilder
type ExerciseData = {
	id: string
	beta: boolean
	nameLocalizations: LocaleStringRecord | null
	descLocalizations: LocaleStringRecord | null
	tags: string[]
	creationDate: number
}

export const DEFAULT_N_QUESTIONS_ID = "_n"
export const DEFAULT_N_QUESTIONS_OPTION = new NumberOption({
	defaultValue: 5,
	max: 10,
	min: 1,
	title: {
		en: "Number of questions",
		fr: "Nombre de questions"
	}
})
export class ExerciseBuilder<
	const Seed extends any[] = [],
	const Answers extends Record<string, any> = {},
	const Opts extends Record<string, OptionBase> = {}
> {
	// Properties
	public options: Record<string, OptionBase> = {}
	public rawData: ExerciseData = {
		id: "",
		beta: false,
		nameLocalizations: null,
		descLocalizations: null,
		tags: [],
		creationDate: 0
	}

	// Constructor
	constructor(id: string) {
		this.rawData.id = id
		return this
	}
	// Methods
	generateSeed!: (userOptions: ExtractDefaults<Opts>) => Seed
	generateContext!: (seed: Seed, lang: Language) => ContextSection[]
	validateAnswers!: (
		seed: Seed,
		answers: Answers
	) => { [K in keyof Answers]: boolean }
	generateSolution!: (seed: Seed) => Answers

	// Getters
	get id() {
		return this.rawData.id
	}

	// Builders
	setName(names: LocaleString) {
		if (typeof names == "string") {
			this.rawData.nameLocalizations = {
				fr: names,
				en: names
			}
		} else {
			this.rawData.nameLocalizations = names
		}
		return this
	}
	setDescription(desc: LocaleString) {
		if (typeof desc == "string") {
			this.rawData.descLocalizations = {
				fr: desc,
				en: desc
			}
		} else {
			this.rawData.descLocalizations = desc
		}
		return this
	}
	setIsBeta(isBeta: boolean) {
		this.rawData.beta = isBeta
		return this
	}
	setTags(tags: string[]) {
		this.rawData.tags = tags
		return this
	}
	setCreationDate(creationDate: number) {
		this.rawData.creationDate = creationDate
		return this
	}
	// now addOption only needs O—you get K for free:
	addOption<const ID extends string, const O extends OptionBase>(
		id: ID,
		option: O
	): ExerciseBuilder<
		Seed,
		Answers,
		Opts & {
			[A in ID]: O
		}
	> {
		if (this.options[id]) {
			console.error(this.serialize("en"))
			throw new Error(`Duplicate option ID: ${id} for exercise ${this.id}`)
		}
		this.options[id] = option
		return this as any
	}
	setSeedGenerator(
		seedGenerator: (userOptions: ExtractDefaults<Opts>) => Seed
	) {
		this.generateSeed = seedGenerator
		return this
	}
	setContextGenerator(
		contextGenerator: (seed: Seed, lang: Language) => ContextSection[]
	) {
		this.generateContext = contextGenerator
		return this
	}
	setAnswersValidator(
		answersValidator: (
			seed: Seed,
			answers: Answers
		) => { [K in keyof Answers]: boolean }
	) {
		this.validateAnswers =
			answersValidator ||
			((seed, answers) => {
				const correction = this.generateSolution(seed)
				const result = {} as { [K in keyof Answers]: boolean }
				for (const key in answers) {
					result[key] = answers[key] === correction[key]
				}
				return result
			})
		return this
	}
	setSolutionGenerator(solutionGenerator: (seed: Seed) => Answers) {
		this.generateSolution = solutionGenerator
		return this
	}
	serialize(lang: Language) {
		const {
			nameLocalizations,
			descLocalizations,
			creationDate,
			tags,
			beta,
			id
		} = this.rawData
		const options = Object.entries(this.options).reduce(
			(o, [id, option]) => {
				return {
					...o,
					[id]: option.config
				}
			},
			{ [DEFAULT_N_QUESTIONS_ID]: DEFAULT_N_QUESTIONS_OPTION }
		) as ExtractConfig<Opts>

		return {
			beta,
			creationDate,
			tags,
			id,
			options,
			name: nameLocalizations?.[lang],
			desc: descLocalizations?.[lang] ?? null
		}
	}
	generate(userOptions: ExtractDefaults<Opts>, lang: Language) {
		const seed = this.generateSeed(userOptions)
		const context = this.generateContext(seed, lang)
		return {
			exercise_id: this.id,
			seed,
			context
		}
	}
}
