import { ExerciseBuilder, ExerciseOption, factorial, OptionType, randomFromInterval } from "@/lib/resources"

type Seed = [n: number, k: number]
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
	id: "combinations",
	names: {
		en: "Combinations",
		fr: "Combinaisons"
	},
	descs: '$^n$C$_r$ = C($n$,$r$) = $(^r_n)$ = $\\frac{n!}{(n-r)!r!}$',
	tags: ['combinatorics'],
	options,

	generateSeed({ interval }) {
		const n = randomFromInterval(...interval)
		const k = randomFromInterval(interval[0], n)
		return [n, k]
	},

	generateContent([n, k]) {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `$(^{${n}}_{${k}})$`, extra: ["latex"] },
					{ type: "text", text: "=" },
					{ type: "input", id: "answer" }
				]
			}
		]
	},

	generateSolution([n, k]) {
		return { answer: factorial(n) / (factorial(k) * factorial(n - k)) }
	}
})
