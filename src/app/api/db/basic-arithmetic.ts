import { ExerciseGenerator } from "../defs"
import { randomFrom, randomFromRange } from "../util"

type Operation = "+" | "-" | "*"
type Seed = [number, Operation, number]
type Answers = { answer: number }
type Options = {
	min: number
	max: number
	n_values: number
}

const getExercise = (id: string) =>
	new ExerciseGenerator<Seed, Answers, Options>({
		id,
		nameLocales: { en: "Basic arithmetic", fr: "Arithmétique elementaire" },
		descLocales: {
			en: "Addition, Substraction, Multiplication...",
			fr: "Addition, Soustraction, Multiplication..."
		},
		tags: ["arithmetic"],
		createdOn: 1,
		options: [
			{
				type: "number",
				id: "min",
				title: "Minimum",
				defaultValue: 1,
				min: 1
			},
			{
				type: "number",
				id: "max",
				title: "Maximum",
				defaultValue: 10,
				max: 10
			}
			// {
			// 	type: "number",
			// 	id: "n_values",
			// 	title: {
			// 		en: "Number of values",
			// 		fr: "Nombre de valeures"
			// 	},
			// 	min: 2,
			// 	defaultValue: 2
			// }
		],
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
						{
							type: "text",
							text: `${n1} ${operation} ${n2} = `
						},
						{
							type: "input",
							id: "answer"
						}
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
						{
							type: "text",
							text: `oui `
						},
						{
							type: "input",
							id: "answer"
						}
					]
				}
			]
		}
	})

export default getExercise
