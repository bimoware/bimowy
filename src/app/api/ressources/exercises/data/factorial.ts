import { ExerciseBuilder, IntervalOption } from "../defs"
import { factorial, randomFromInterval } from "@api/util"

type Seed = [n: number]
type Answers = { answer: number }

export default new ExerciseBuilder<Seed, Answers>("factorial")
	.setName({
		en: "Factorial",
		fr: "Factorielle"
	})
	.setTags(["arithmetic"])
	.setDescription("5! = 5*4*3*2*1 = 120")
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
			randomFromInterval(...interval)
		]
	})
	.setContextGenerator(([n]) => {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `${n}! = ` },
					{ type: "input", id: "answer" }
				]
			}
		]
	})
	.setSolutionGenerator(([n]) => {
		return {
			answer: factorial(n)
		}
	})