import { ExerciseGenerator, OptionValuesFrom } from "../defs"
import { randomFrom, randomFromRange } from "../util"

type Seed = [number, "+" | "-" | "*", number]
type Answers = { answer: number }

const optionDefs = {
	range: {
		type: "range",
		id: "range",
		title: {
			en: "Range of values",
			fr: "Plage des valeurs"
		},
		defaultValue: [0, 10] as [number, number]
	}
} as const

const getExercise = (id: string) =>
	new ExerciseGenerator<Seed, Answers, OptionValuesFrom<typeof optionDefs>>({
		id,
		nameLocales: {
			en: "Basic arithmetic",
			fr: "Arithmétique élémentaire"
		},
		descLocales: {
			en: "Addition, Substraction, Multiplication...",
			fr: "Addition, Soustraction, Multiplication..."
		},
		tags: ["arithmetic"],
		createdOn: 1,
		optionDefs,
		validateAnswers(seed, { answer }) {
			const solution = this.getSolution(seed)["answer"]
			return { answer: solution == answer }
		},
		generateSeed: ({ range }) => {
			return [
				randomFromRange(...range),
				randomFrom(["*", "+", "-"]),
				randomFromRange(...range)
			]
		},
		getContext([n1, operation, n2], lang) {
			return [
				{
					type: "p",
					content: [
						{ type: "text", text: `${n1} ${operation} ${n2} = ` },
						{ type: "input", id: "answer" }
					]
				}
			]
		},
		getSolution([n1, operation, n2]) {
			return {
				answer: {
					"+": n1 + n2,
					"-": n1 - n2,
					"*": n1 * n2
				}[operation]
			}
		}
	})

export default getExercise
