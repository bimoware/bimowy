import { ExerciseBuilder, IntervalOption, NumberOption } from "../../exercises/defs"
import { randomFromInterval } from "../../util"

type Seed = number[]
type Answers = { answer: Seed[number] }

const exercise = new ExerciseBuilder<Seed, Answers>("median")
	.setName({ en: "Median", fr: "Mediane" })
	.setDescription({
		en: "Median of [2, 2, 3, 9] = 2.5",
		fr: "Medianne de [2, 2, 3, 9] = 2.5"
	})
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
	.addOption(
		"n_values",
		new NumberOption({
			title: {
				fr: "Nombre de valeurs",
				en: "Number of values"
			},
			defaultValue: 4,
			min: 2
		})
	)
	.setSeedGenerator(({ interval, n_values }) => Array
		.from({ length: n_values })
		.map(() => randomFromInterval(...interval))
	)
	.setContextGenerator((ns, lang) => {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: {
							en: "Median of",
							fr: "La medianne de"
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
	})
	.setSolutionGenerator((ns) => {
		const sortedNs = ns.sort()
		const n = ns.length
		const middleI = Math.floor((n - 1) / 2)
		return {
			answer: n % 2 == 0
				? (sortedNs[middleI] + sortedNs[middleI + 1]) / 2
				: sortedNs[middleI]
		}
	})


export default exercise