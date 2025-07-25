import { ExerciseBuilder, ExerciseOption, OptionType, randomFromInterval } from "@/lib/resources"

type Seed = [a: number, b: number]
type Answers = { answer: number }

const options = {
	interval: new ExerciseOption({
		type: OptionType.Interval,
		title: {
			en: "Interval of values",
			fr: "Intervalle des valeurs"
		},
		defaultValue: [0, 10]
	})
}

export default new ExerciseBuilder<Seed, Answers, typeof options>({
	id: "multiplication",
	names: {
		en: "Multiplication",
		fr: "Multiplication"
	},
	descs: "11 * 11 = 121",
	tags: ["arithmetic"],
	options,

	generateSeed({ interval }) {
		return [
			randomFromInterval(...interval),
			randomFromInterval(...interval)
		]
	},

	generateContent([n1, n2]) {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `${n1} * ${n2} = ` },
					{ type: "input", id: "answer" }
				]
			}
		]
	},

	generateSolution([n1, n2]) {
		return {
			answer: n1 * n2
		}
	}
})
