import { ExerciseBuilder, IntervalOption } from "../defs"
import { randomFromInterval } from "@api/util"
type Seed = [[x1: number, y1: number], [x2: number, y2: number]]
type Answers = { answer: number }

export default new ExerciseBuilder<Seed, Answers>("distance-between-points")
	.setDescription({
		en: "| From (1,1) to (4,5) | = 5",
		fr: "| De (1,1) à (4,5) | = 5"
	})
	.setTags(["plane"])
	.addOption(
		"interval",
		new IntervalOption({
			title: {
				en: "Range of values",
				fr: "Plage des valeurs"
			},
			defaultValue: [-10, 10]
		})
	)
	.setName({
		en: "Distance between 2 points",
		fr: "Distance entre 2 points"
	})
	.setSeedGenerator(({ interval }) => {
		return [
			[randomFromInterval(...interval), randomFromInterval(...interval)],
			[randomFromInterval(...interval), randomFromInterval(...interval)]
		]
	})
	.setContextGenerator(([[x1, y1], [x2, y2]], lang) => {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: {
							en: "The distance between",
							fr: "Le vecteur qui commence de"
						}[lang]
					},
					{
						type: "text",
						text: `A(${x1},${y1})`,
						extra: ["mono"]
					},
					{
						type: "text",
						text: { en: "and", fr: "et" }[lang]
					},
					{
						type: "text",
						text: `B(${x2},${y2})`,
						extra: ["mono"]
					},
					{
						type: "text",
						text: { en: "is", fr: "est" }[lang]
					},
					{
						type: "input",
						id: 'answer'
					}
				]
			}
		]
	})
	.setSolutionGenerator(([[x1, y1], [x2, y2]]) => {
		const xDiff = x2 - x1
		const yDiff = y2 - y1
		const norm = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
		return {
			answer: Number(norm.toFixed(2))
		}
	})
