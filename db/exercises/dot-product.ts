import { ExerciseBuilder, IntervalOption } from "../../exercises/defs"
import { randomFromInterval } from "../../util"

type Seed = [[x1: number, y1: number], [x2: number, y2: number]]
type Answers = { answer: number }

export default new ExerciseBuilder<Seed, Answers>("dot-product")
	.setName({
		en: "Dot product",
		fr: "Produit scalaire"
	})
	.setDescription('<1, 2> ⋅ <3, 4> = 11')
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
		return [[0, 0], [0, 0]]
			.map(_ => _
				.map(() => randomFromInterval(...interval))) as [[number, number], [number, number]]
	})
	.setContextGenerator(([[x1, y1], [x2, y2]]) => {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `<${x1},${y1}> ⋅ <${x2},${y2}> = ` },
					{ type: "input", id: "answer" }
				]
			}
		]
	})
	.setSolutionGenerator(([[x1, y1], [x2, y2]]) => {
		return {
			answer: x1 * x2 + y1 * y2
		}
	})
