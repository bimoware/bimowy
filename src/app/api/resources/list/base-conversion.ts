import { ExerciseBuilder } from "@api/lib/exercise"
import { NumberOption, RadioOption } from "@api/lib/option"
import { randomFromInterval } from "@util/random"

const bases = ["binary", "decimal", "hexadecimal"] as const
type Base = (typeof bases)[number]

type Seed = [n: string, from: Base, to: Base]
type Answers = { answer: string }

const options = {
	max: new NumberOption({
		defaultValue: 2 ** 12,
		title: {
			en: "Maximum",
			fr: "Maximum"
		},
		min: 0
	}),
	from: new RadioOption({
		defaultValue: bases[0],
		title: {
			en: "From",
			fr: "De"
		},
		options: [...bases]
	}),
	to: new RadioOption({
		defaultValue: bases[0],
		title: {
			en: "To",
			fr: "À"
		},
		options: [...bases]
	})
}

export default new ExerciseBuilder<Seed, Answers, typeof options>({
	id: "base-conversion",
	names: {
		en: "Base conversion",
		fr: "Conversion de base numérique"
	},
	tags: ["conversion"],
	descs: '101010$_2$ = 42$_{10}$ = 2A$_{16}$',
	options,

	generateSeed({ max, from, to }) {
		const n = randomFromInterval(0, max)
		return [
			n.toString(
				{
					binary: 2,
					decimal: 10,
					hexadecimal: 16
				}[from]).toUpperCase(),
			from,
			to
		]
	},

	generateContext([n, from, to], lang) {
		const fixedBases = {
			en: {
				decimal: "decimal",
				binary: "binary",
				hexadecimal: "hexadecimal"
			},
			fr: {
				decimal: "décimal",
				binary: "binaire",
				hexadecimal: "héxadecimal"
			}
		}[lang]

		return [
			{
				type: "p",
				content: [
					{ type: "text", text: { fr: `Convertis`, en: `Convert` }[lang] },
					{ type: "text", text: `${n}`, extra: ["mono"] },
					{ type: "text", text: `(${fixedBases[from]})` },
					{ type: "text", text: `to ${fixedBases[to]}: ` },
					{ type: "input", id: "answer" }
				]
			}
		]
	},

	generateSolution([n, from, to]) {
		const baseRadix = { binary: 2, decimal: 10, hexadecimal: 16 }
		const originalN = parseInt(n, baseRadix[from])
		const answer = originalN.toString(baseRadix[to])
		return { answer }
	},

	validateOptions(userOptions) {
		if (userOptions["from"] === userOptions["to"]) {
			return {
				en: `Change the options 'From' and 'To'. They can't be the same. (I'm not gonna ask you to convert a number from decimal to decimal lmfao kys)`,
				fr: `Change les options 'De' et 'À', ils ne peuvent pas étre les mêmes. (Je vais pas te demander de convertir un nombre de decimal à decimal par exemple ptdrr arrache ta tete toi)`
			}
		}
	}
})
