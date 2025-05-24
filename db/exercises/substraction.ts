import { ExerciseBuilder, IntervalOption } from "../../exercises/defs"
import { randomFromInterval } from "../../util"

type Seed = [a: number, b: number]
type Answers = { answer: number }

export default new ExerciseBuilder<Seed, Answers>("substraction")
	.setName({
		en: 'Substraction',
		fr: "Soustraction"
	})
	.setDescription('100 - 1 = 99')
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
		return [
			randomFromInterval(...interval),
			randomFromInterval(...interval)
		]
	})
	.setContextGenerator(([n1, n2] /*, lang*/) => {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `${n1} - ${n2} = ` },
					{ type: "input", id: "answer" }
				]
			}
		]
	})
	.setSolutionGenerator(([n1, n2]) => {
		return {
			answer: n1 - n2
		}
	})
