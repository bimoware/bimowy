import { LocaleRecord, LanguageCode } from "@/lib/locale";
import { RawResourceBuilder, ResourceConfig, ResourceType } from "./resource";
import { DefaultValueFromOptions, ExerciseOption, ExerciseOptions } from "./option";
import { ExerciseContent } from "./content";

export type ExerciseSeed = unknown[]
export type ExerciseAnswers = Record<string, unknown>


type ExerciseConfigSimple<S, A, O extends ExerciseOptions> =
	Omit<ResourceConfig<ResourceType.Exercise>, "type">
	& {
		options: O;
		generateSeed: (opts: DefaultValueFromOptions<O>) => S;
		generateContent: (seed: S, lang: LanguageCode) => ExerciseContent;
		generateSolution: (seed: S) => A;
		validateOptions?: (opts: DefaultValueFromOptions<O>) => LocaleRecord | void;
		validateAnswers?: (seed: S, ans: A) => Record<keyof A, boolean>;
	};

export class ExerciseBuilder<
	S extends ExerciseSeed,
	A extends ExerciseAnswers,
	O extends ExerciseOptions
> extends RawResourceBuilder<ExerciseConfigSimple<S, A, O> & { type: ResourceType.Exercise }> {
	// now only three generics
	options: O;
	generateSeed: (opts: DefaultValueFromOptions<O>) => S;
	generateContent: (seed: S, lang: LanguageCode) => ExerciseContent;
	generateSolution: (seed: S) => A;
	validateOptions: (opts: DefaultValueFromOptions<O>) => LocaleRecord | void;
	validateAnswers: (seed: S, ans: A) => Record<keyof A, boolean>;

	constructor(cfg: ExerciseConfigSimple<S, A, O>) {
		super({ ...cfg, type: ResourceType.Exercise });
		this.options = cfg.options;
		this.generateSeed = cfg.generateSeed;
		this.generateContent = cfg.generateContent;
		this.generateSolution = cfg.generateSolution;
		this.validateOptions = cfg.validateOptions ?? (() => { });
		// bring in user‑provided or default validateAnswers
		this.validateAnswers = cfg.validateAnswers
			?? ((seed, answers) => {
				const sol = this.generateSolution(seed);
				return Object.keys(answers)
					.reduce((res, k) => {
						res[k as keyof A] = answers[k] === sol[k];
						return res;
					}, {} as Record<keyof A, boolean>);
			});
	}

	generate(userOptions: DefaultValueFromOptions<O>, lang: LanguageCode) {
		const seed = this.generateSeed(userOptions)
		return { seed, exercise_id: this.id, content: this.generateContent(seed, lang) }
	}
	serialize(lang: LanguageCode) {
		const options = Object.entries(this.options).reduce((acc, [id, opt]) => {
			acc[id] = opt.serialize(lang)
			return acc
		}, {} as Record<string, ReturnType<ExerciseOption["serialize"]>>)


		return {
			...super.serialize(lang),
			options
		}
	}
}

export type AnyExerciseBuilder = ExerciseBuilder<ExerciseSeed, ExerciseAnswers, ExerciseOptions>