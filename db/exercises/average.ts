import { ExerciseBuilder, IntervalOption, NumberOption } from "../../exercises/defs"
import { randomFromInterval } from "../../util"

type Seed = number[]
type Answers = { answer: Seed[number] }

const exercise = new ExerciseBuilder<Seed, Answers>("average")
	.setName("Average")
	.setDescription({
		en: "Average of [2, 3, 5, 6] = 4",
		fr: "Moyenne de [2, 3, 5, 6] = 4"
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
			min: 1
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
	})
	.setSolutionGenerator((ns) => {
		const total = ns.reduce((prev, curr) => prev + curr, 0)
		return {
			answer: total / ns.length
		}
	})

exercise
	.setAnswersValidator((ns, { answer }) => {
		const solution = exercise.generateSolution(ns)
		return {
			answer: Math.abs(solution.answer - answer) <= 0.01
		}
	})


export default exercise