import { ExerciseGenerator, Language } from "../defs"

type Seed = [x: number, y: number]
type Answers = { answer: number }
type Options = { min: number; max: number }

const getExercise = (id: string) =>
	new ExerciseGenerator<Seed, Answers, Options>({
		id,
		nameLocales: { fr: "Norme de vecteur", en: "Vector Norm" },
		descLocales: {
			fr: "Ou sa 'longeur'",
			en: "i.e it's 'length'."
		},
		createdOn: 4,
		tags: ["linear-algebra"],
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
			const range = [-9, 9]
			const [x, y] = Array(4)
				.fill(range)
				.map((r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0])
			return [x, y]
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
		},
		getDetailedSolution(seed: number[]) {
			return [
				{
					type: "p",
					content: [
						{
							type: "text",
							text: "[Solution Here]"
						}
					]
				}
			]
		}
	})

export default getExercise
