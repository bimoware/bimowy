import { LocaleRecord, LanguageCode } from "@/utils/locale";

export enum OptionType {
	Number = "number",
	Radio = "radio",
	Interval = "interval",
	Boolean = "boolean",
	Checkboxes = "checkboxes"
}

// Base Option
export type BaseOptionConfig = {
	title: LocaleRecord;
	defaultValue: unknown;
};

export abstract class OptionBase<
	T extends OptionType,
	C extends BaseOptionConfig
> {
	constructor(
		public type: T,
		public config: C
	) { }
	serialize(lang: LanguageCode) {
		return {
			type: this.type,
			...this.config,
			title: this.config.title?.[lang]
		};
	}
}

// Opts (Options) is a record w/ keys=option IDs & values=OptType
export type OptsType = Record<string, OptionBase<any, any>>


// User
export type ExtractDefaultValueFromOptions<
	O extends OptsType
> = {
		[K in keyof O]: O[K]["config"]["defaultValue"];
	};

export type UserOptions = Record<string, unknown> & { [DEFAULT_N_QUESTIONS_ID]: number; };
export type UserAnswers = Record<string, unknown>;

// Number
type NumberConfig = BaseOptionConfig & {
	defaultValue: number;
	min?: number;
	max?: number;
};
export class NumberOption extends OptionBase<OptionType.Number, NumberConfig> {
	constructor(public config: NumberConfig) {
		super(OptionType.Number, config);
	}
}
// Boolenan
type BooleanConfig = BaseOptionConfig & {
	defaultValue: boolean;
};
export class BooleanOption extends OptionBase<
	OptionType.Boolean, BooleanConfig
> {
	constructor(public config: BooleanConfig) {
		super(OptionType.Boolean, config);
	}
}
// Radio
type AllowedRadioOptionType = number | string;
type RadioConfig<T> = BaseOptionConfig & {
	options: T[];
	defaultValue: T;
};

export class RadioOption<T extends AllowedRadioOptionType> extends OptionBase<
	OptionType.Radio, RadioConfig<T>
> {
	constructor(public config: RadioConfig<T>) {
		super(OptionType.Radio, config);
	}
}
// Radio
type IntervalConfig = BaseOptionConfig & {
	defaultValue: [number, number];
};

export class IntervalOption extends OptionBase<
	OptionType.Interval, IntervalConfig
> {
	constructor(public config: IntervalConfig) {
		super(OptionType.Interval, config);
	}
}
// Checkboxes
type CheckboxesConfig<T> = BaseOptionConfig & {
	defaultValue: T[];
	options: T[];
};

export class CheckboxesOption<T> extends OptionBase<
	OptionType.Checkboxes, CheckboxesConfig<T>
> {
	constructor(public config: CheckboxesConfig<T>) {
		super(OptionType.Checkboxes, config);
	}
}
// ..
export type APIOption = ReturnType<
	(NumberOption |
		RadioOption<any> |
		IntervalOption |
		BooleanOption |
		CheckboxesOption<any>)["serialize"]
>;

export type APIOptions = Record<string, APIOption>;

export const DEFAULT_N_QUESTIONS_ID = "_n";
export const DEFAULT_N_QUESTIONS_OPTION = new NumberOption({
	defaultValue: 5,
	max: 10,
	min: 1,
	title: {
		en: "Number of questions",
		fr: "Nombre de questions"
	}
});
