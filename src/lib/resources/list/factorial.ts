import { ExerciseBuilder, ExerciseOption, factorial, OptionType, randomFromInterval } from "@/lib/resources"

type Seed = [n: number]
type Answers = { answer: number }

const options = {
	"interval": new ExerciseOption({
		type: OptionType.Interval,

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
	options,
	id: "factorial",
	names: ({
		en: "Factorial",
		fr: "Factorielle"
	}),
	tags: ["arithmetic"],
	descs: "5! = 5*4*3*2*1 = 120",
	generateSeed({ interval }) {
		return [
			randomFromInterval(...interval)
		]
	},
	generateContent([n]) {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `${n}! = ` },
					{ type: "input", id: "answer" }
				]
			}
		]
	},
	generateSolution([n]) {
		return {
			answer: factorial(n)
		}
	}
})