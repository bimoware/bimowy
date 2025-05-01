import { ExerciseGenerator, OptionValuesFrom, RawOption } from "../defs"
import { randomFrom, randomFromRange } from "../util"

type Seed = [number, "+" | "-" | "*", number]
type Answers = { answer: number }

const optionDefs = {
	min: {
		type: "number",
		id: "min",
		title: "Minimum",
		defaultValue: 1,
		min: 1
	},
	max: {
		type: "number",
		id: "max",
		title: "Maximum",
		defaultValue: 10,
		max: 10
	},
	n_values: {
		type: "number",
		id: "n_values",
		title: {
			en: "Number of values",
			fr: "Nombre de valeurs"
		},
		defaultValue: 2,
		min: 2
	},
	something: {
		type: "boolean",
		title: "Something",
		id: "something",
		defaultValue: false
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
		generateSeed: ({ min, max }) => {
			return [
				randomFromRange(min, max),
				randomFrom(["*", "+", "-"]),
				randomFromRange(min, max)
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
		},
		getDetailedSolution(seed) {
			return [
				{
					type: "p",
					content: [
						{ type: "text", text: "oui " },
						{ type: "input", id: "answer" }
					]
				}
			]
		}
	})

export default getExercise
