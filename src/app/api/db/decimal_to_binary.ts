import { ExerciseGenerator } from "../defs"

type Seed = [n: number]
type Answers = { answer: string }
type Options = { min: number; max: number }

const getExercise = (id: string) =>
	new ExerciseGenerator<Seed, Answers,Options>({
		id,
		nameLocales: { en: "Decimal to binary", fr: "Decimal à Binaire" },
		descLocales: {
			en: "Convert a decimal number to binary (69 -> 1000101)",
			fr: "Convertir un nombre de decimal en binaire (69 -> 1000101)",
		},
		tags: [],
		createdOn: 2,
		options: [
			{
				type: "number",
				id: "min",
				title: "Minimum",
				defaultValue: 0,
				min: 0
			},
			{
				type: "number",
				id: "max",
				title: "Maximum",
				defaultValue: 10,
				max: 10
			}
		],
		generateSeed() {
			return [Math.floor(Math.random() * 2 ** 10)]
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
								en: `The number ${n} in binary is `,
							}[lang],
						},
						{
							type: "input",
							id: "answer",
						},
					],
				},
			]
		},
		validateAnswers([n]: Seed, { answer }: Answers) {
			return {
				answer: answer == this.getSolution([n])["answer"],
			}
		},
		getSolution([n]: Seed) {
			return {
				answer: n.toString(2),
			}
		},
		getDetailedSolution([n]: Seed) {
			return [
				{
					type: "p",
					content: [
						{
							type: "text",
							text: `${n} -> ${this.getSolution([n])} (yes it's that simple)`,
						},
					],
				},
			]
		},
	})

export default getExercise
