import { ExerciseBuilder } from "@api/lib/exercise"
import { IntervalOption, NumberOption } from "@api/lib/option"
import { randomFromInterval } from "@util/random"

type Seed = number[]
type Answers = { answer: Seed[number] }

const options = {
	"interval": new IntervalOption({
		title: {
			en: "Interval of values",
			fr: "Intervalle des valeurs"
		},
		defaultValue: [0, 10]
	}),
	"n_values": new NumberOption({
		title: {
			fr: "Nombre de valeurs",
			en: "Number of values"
		},
		defaultValue: 4,
		min: 1
	})
}
export default new ExerciseBuilder<
	Seed,
	Answers,
	typeof options
>({
	id: "average",
	names: "Average",
	descs: {
		en: "Average of [2, 3, 5, 6] = 4",
		fr: "Moyenne de [2, 3, 5, 6] = 4"
	},
	tags: ['arithmetic', 'lists'],
	options,
	generateSeed({ interval, n_values }) {
		return Array
			.from({ length: n_values })
			.map(() => randomFromInterval(...interval))
	},
	generateContext(ns, lang) {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: {
							en: "Average of",
							fr: "La moyenne de"
						}[lang]
					},
					{
						type: "text",
						text: `[ ${ns.join(', ')} ]`
					},
					{
						type: "text",
						text: {
							en: "is ",
							fr: "est "
						}[lang]
					},
					{ type: "input", id: "answer" }
				]
			}
		]
	},
	generateSolution(ns) {
		const total = ns.reduce((prev, curr) => prev + curr, 0)
		return {
			answer: total / ns.length
		}
	},
	validateAnswers(ns, { answer }) {
		const solution = this.generateSolution(ns)
		return {
			answer: Math.abs(solution.answer - answer) <= 0.01
		}
	}
})