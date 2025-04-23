import { ExerciseGenerator } from "../defs"

type Seed = [n: number]
type Answers = { answer: string }

const ex = new ExerciseGenerator<Seed, Answers>({
	id: "decimal_to_binary",
	nameLocales: { en: "Decimal to binary", fr: "Decimal à Binaire" },
	descLocales: {
		en: "Convert a decimal number to binary (69 -> 1000101)",
		fr: "Convertir un nombre de decimal à binary (69 -> 1000101)",
	},
	tags: [],
	createdOn: 5,
	generateSeed: function () {
		return [Math.floor(Math.random() * 2 ** 10)]
	},
	getContext: function ([n]: Seed, lang) {
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
	validateAnswers: function ([n]: Seed, answers: Answers) {
		return {
			answer: answers["answer"] == this.getSolution([n])["answer"],
		}
	},
	getSolution: function ([n]: Seed) {
		return {
			answer: n.toString(2),
		}
	},
	getDetailedSolution: function ([n]: Seed) {
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

export default ex
