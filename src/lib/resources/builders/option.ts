import { LanguageCode, LocaleString, toLocaleString } from "@/lib/locale"

export enum OptionType {
	Number = "number",
	Boolean = "boolean",
	Interval = "interval",
	Radio = "radio",
	Checkboxes = "checkboxes"
}

type BaseOptionConfig = {
	title: LocaleString
}

type NumberOptionConfig = {
	type: OptionType.Number, defaultValue: number
	min?: number
	max?: number
}

type BooleanOptionConfig = {
	type: OptionType.Boolean, defaultValue: boolean
}

type IntervalOptionConfig = {
	type: OptionType.Interval, defaultValue: [number, number]
}

type AllowedType = string
type RadioOptionConfig<T extends AllowedType> = {
	type: OptionType.Radio, defaultValue: T
	options: T[]
}

type CheckboxesOptionConfig<T extends AllowedType> = {
	type: OptionType.Checkboxes, defaultValue: T[]
	options: T[]
}

export type OptionConfig<T extends AllowedType = AllowedType> =
	| NumberOptionConfig
	| BooleanOptionConfig
	| IntervalOptionConfig
	| RadioOptionConfig<T>
	| CheckboxesOptionConfig<T>

export class ExerciseOption<C extends OptionConfig = OptionConfig> {
	config: BaseOptionConfig & C
	constructor(config: BaseOptionConfig & C) {
		this.config = config
	}
	serialize(lang: LanguageCode) {
		return {
			...this.config,
			title: toLocaleString(this.config.title)[lang]
		};
	}
}

export type ExerciseOptions = Record<string, ExerciseOption>
export type UserOptionsValues = DefaultValueFromOptions<ExerciseOptions>

type DefaultValueOfOption<O extends ExerciseOption> = O["config"]["defaultValue"]

export type DefaultValueFromOptions<O extends ExerciseOptions> = {
	[K in keyof O]: DefaultValueOfOption<O[K]>;
};

export const DEFAULT_N_QUESTIONS_ID = "_n";
export const DEFAULT_N_QUESTIONS_OPTION = new ExerciseOption({
	type: OptionType.Number,
	defaultValue: 5,
	max: 10,
	min: 1,
	title: {
		en: "Number of questions",
		fr: "Nombre de questions"
	}
});