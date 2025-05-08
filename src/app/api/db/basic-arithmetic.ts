import { ExerciseBuilder, IntervalOption } from "../defs"
import { randomFrom, randomFromInterval } from "../util"

const operations = ["+", "-", "*" /*,"%"*/] as const
type Operation = (typeof operations)[number]
type Seed = [a: number, operation: Operation, b: number]
type Answers = { answer: number }

export default new ExerciseBuilder<Seed, Answers>("basic-arithmetic")
	.setName({
		en: "Basic arithmetic",
		fr: "Arithmétique élémentaire"
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
	.setTags(["addition", "substraction", "modulo", "multiplication"])
	.setCreationDate(1)
	.setSeedGenerator(({ interval }) => {
		return [
			randomFromInterval(...interval),
			randomFrom(["*", "+", "-"]),
			randomFromInterval(...interval)
		]
	})
	.setContextGenerator(([n1, operation, n2] /*, lang*/) => {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `${n1} ${operation} ${n2} = ` },
					{ type: "input", id: "answer" }
				]
			}
		]
	})
	.setSolutionGenerator(([n1, operation, n2]) => {
		return {
			answer: {
				"+": n1 + n2,
				"-": n1 - n2,
				"*": n1 * n2
			}[operation]
		}
	})
