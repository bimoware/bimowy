import { ExerciseGenerator, OptionValuesFrom } from "../defs"
import { randomFromRange } from "../util"

type Seed = [number]
type Answers = { answer: string }

const optionDefs = {
	max: {
		type: "number",
		id: "max",
		title: {
			en: "Maximum value to convert",
			fr: "Valeure maximum à convert"
		},
		min: 0,
		defaultValue: 2 ** 12
	}
} as const

const getExercise = (id: string) =>
	new ExerciseGenerator<Seed, Answers, OptionValuesFrom<typeof optionDefs>>({
		id,
		nameLocales: { en: "Decimal to binary", fr: "Decimal à Binaire" },
		descLocales: {
			en: "Convert a decimal number to binary (69 -> 1000101)",
			fr: "Convertir un nombre de decimal en binaire (69 -> 1000101)"
		},
		tags: [],
		createdOn: 2,
		optionDefs,
		generateSeed({ max }) {
			return [randomFromRange(0, max)]
		},
		getContext([n]: Seed, lang) {
			return [
				{
					type: "p",
					content: [
						{
							type: "text",
							text: {
								fr: `Le nombre ${n} en binaire est `,
								en: `The number ${n} in binary is `
							}[lang]
						},
						{
							type: "input",
							id: "answer"
						}
					]
				}
			]
		},
		validateAnswers([n]: Seed, { answer }: Answers) {
			return { answer: answer == this.getSolution([n])["answer"] }
		},
		getSolution([n]: Seed) {
			return { answer: n.toString(2) }
		}
	})

export default getExercise
