import { ExerciseBuilder, IntervalOption } from "../defs"
import { factorial, randomFromInterval } from "@api/util"

type Seed = [n: number, k: number]
type Answers = { answer: number }

const exercise = new ExerciseBuilder<Seed, Answers>("combinations")
	.setName({
		en: "Combinations",
		fr: "Combinaisons"
	})
	.setTags(['combinatorics'])
	.setDescription('$^n$C$_r$ = C($n$,$r$) = $(^r_n)$ = $\\frac{n!}{(n-r)!r!}$')
	.addOption(
		"interval",
		new IntervalOption({
			title: {
				en: "Interval of values",
				fr: "Intervalle des valeurs"
			},
			defaultValue: [0, 10]
		})
	)
	.setSeedGenerator(({ interval }) => {
		const n = randomFromInterval(...interval)
		const k = randomFromInterval(interval[0], n)
		return [n, k]
	})
	.setContextGenerator(([n, k]) => {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: `$(^{${n}}_{${k}})$`,
						extra: ["latex"]
					},
					{
						type: "text",
						text: "="
					},
					{
						type: "input",
						id: "answer"
					}
				]
			}
		]
	})
	.setSolutionGenerator(([n, k]) => {
		return { answer: factorial(n) / (factorial(k) * factorial(n - k)) }
	})
export default exercise