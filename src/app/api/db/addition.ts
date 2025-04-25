import { ExerciseGenerator } from "../defs"

type Seed = [n1: number, n2: number]
type Answers = { answer: number }

const getExercise = (id: string) =>
	new ExerciseGenerator<Seed, Answers>({
		id,
		nameLocales: { en: "Addition", fr: "Addition" },
		tags: ["basic-arithmetic"],
		createdOn: 1,
		options: [
			{
				type: "number",
				id: "min",
				title: "Minimum",
				defaultValue: 1,
				min: 1,
			},
			{
				type: "number",
				id: "max",
				title: "Maximum",
				defaultValue: 10,
				max: 10,
			},
		],
		generateSeed(options) {
			const range = [
				options.find((o) => o.id == "min")?.value ?? 0,
				options.find((o) => o.id == "max")?.value ?? 100,
			]
			const [n1, n2] = Array(2)
				.fill(range)
				.map((r) => Math.floor(Math.random() * (r[1] - r[0]) + r[0]))
			return [n1, n2]
		},
		getContext([n1, n2]: Seed) {
			return [
				{
					type: "p",
					content: [
						{
							type: "text",
							text: `${n1} + ${n2} = `,
						},
						{
							type: "input",
							id: "answer",
						},
					],
				},
			]
		},
		validateAnswers([n1, n2]: Seed, answers: Answers) {
			return {
				answer: answers["answer"] == this.getSolution([n1, n2])["answer"],
			}
		},
		getSolution(seed: Seed) {
			return {
				answer: seed[0] + seed[1],
			}
		},
		getDetailedSolution(seed: Seed) {
			return [
				{
					type: "p",
					content: [
						{
							type: "text",
							text: `${seed.join(" + ")} = ${this.getSolution(seed)} (yes it's that simple)`,
						},
					],
				},
			]
		},
	})
export default getExercise
