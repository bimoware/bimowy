import { ExerciseGenerator, Language, OptionValuesFrom } from "../defs"
import { randomFromRange } from "../util"

type Seed = [x: number, y: number]
type Answers = { answer: number }

const optionDefs = {
	range: {
		type: "range",
		id: "range",
		title: {
			en: "Range of values",
			fr: "Plage des valeurs"
		},
		defaultValue: [-10, 10] as [number, number]
	}
} as const

const getExercise = (id: string) =>
	new ExerciseGenerator<Seed, Answers, OptionValuesFrom<typeof optionDefs>>({
		id,
		nameLocales: { fr: "Norme de vecteur", en: "Vector Norm" },
		descLocales: {
			fr: "Sa 'longeur'",
			en: "It's 'length'."
		},
		createdOn: 4,
		tags: ["linear-algebra"],
		optionDefs,
		generateSeed({ range }) {
			return [randomFromRange(...range), randomFromRange(...range)]
		},
		getContext([x, y]: number[], lang: Language) {
			return [
				{
					type: "p",
					content: [
						{
							type: "text",
							text: "The norm of the vector"
						},
						{
							type: "text",
							text: `<${x},${y}>`,
							extra: ["mono"]
						},
						{
							type: "text",
							text: " = "
						},
						{
							type: "input",
							id: "answer"
						}
					]
				}
			]
		},
		validateAnswers([x, y], answers) {
			const { answer } = this.getSolution([x, y])
			return {
				answer: Math.abs(answer - answers["answer"]) <= 0.01
			}
		},
		getSolution([x, y]: Seed) {
			return {
				answer: Number(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).toFixed(2))
			}
		}
	})

export default getExercise
