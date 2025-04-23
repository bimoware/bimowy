import { ExerciseGenerator } from "../defs"

type Seed = [n1: number, n2: number]
type Answers = { answer: number }

const ex = new ExerciseGenerator<Seed, Answers>({
	id: "multiplication",
  nameLocales: { en: "Multiplication", fr: "Multiplication" },
	tags: ["basic-arithmetic"],
	createdOn: 3,
	generateSeed: function () {
		const range = [1, 10]
		const [n1, n2] = Array(2)
			.fill(range)
			.map((r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0])
		return [n1, n2]
	},
	getContext: function ([n1, n2]: Seed) {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: `${n1} * ${n2} = `,
					},
					{
						type: "input",
						id: "answer",
					},
				],
			},
		]
	},
	validateAnswers: function ([n1, n2]: Seed, answers: Answers) {

		return {
			answer: answers["answer"] == this.getSolution([n1, n2])["answer"],
		}
	},
	getSolution: function (seed: Seed) {
		return {
			answer: seed[0] * seed[1]
		}
	},
	getDetailedSolution: function (seed: Seed) {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: `${seed.join(" * ")} = ${this.getSolution(seed)} (yes it's that simple)`,
					},
				],
			},
		]
	},
})

export default ex
