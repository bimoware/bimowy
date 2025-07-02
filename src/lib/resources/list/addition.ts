import { ExerciseBuilder, IntervalOption, randomFromInterval } from "@/lib/resources"

type Seed = [a: number, b: number]
type Answers = { answer: number }

const options = {
	"interval": new IntervalOption({
		title: {
			en: "Interval of values",
			fr: "Intervalle des valeurs"
		},
		defaultValue: [0, 10]
	})
}

export default new ExerciseBuilder<
	Seed,
	Answers,
	typeof options
>({
	id: "addition",
	names: "Addition",
	descs: "1 + 1 = 2",
	tags: ["arithmetic"],
	options,
	generateSeed({ interval }) {
		return [
			randomFromInterval(...interval),
			randomFromInterval(...interval)
		]
	},
	generateContext([n1, n2]) {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `${n1} + ${n2} = ` },
					{ type: "input", id: "answer" }
				]
			}
		]
	},
	generateSolution([n1, n2]) {
		return {
			answer: n1 + n2
		}
	}
})
