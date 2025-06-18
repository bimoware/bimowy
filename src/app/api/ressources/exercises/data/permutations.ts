import { ExerciseBuilder, IntervalOption } from "../defs"
import { factorial, randomFromInterval } from "@api/util"

type Seed = [n: number, k: number]
type Answers = { answer: number }

const exercise = new ExerciseBuilder<Seed, Answers>("permutations")
	.setName({
		en: "Permutations",
		fr: "Permutations"
	})
	.setTags(['combinatorics'])
	.setDescription('$^n$P$_r$ = P$(n,r)$ = $\\frac{n!}{(n-r)!}$')
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
	.setContextGenerator(([n, k], lang) => {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: `$^\{${n}}P_{${k}}$ = `,
						extra: ["latex"]
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
		return { answer: factorial(n) / factorial(n - k) }
	})
export default exercise