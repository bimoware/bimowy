import { ExerciseBuilder, IntervalOption } from "../defs"
import { randomFromInterval } from "../../util"

type Dimension = [x: number, y: number]
type Seed = [Dimension, Dimension]
type Answers = { x: number; y: number }

export default new ExerciseBuilder<Seed, Answers>("points-to-vector")
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
		en: "Points to vector",
		fr: "Points à vecteur"
	})
	.setDescription({
		en: "Convert 2 points into a vector",
		fr: "Convertir 2 points en un vecteur"
	})
	.setTags(["linear-algebra"])
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
							en: "The vector that goes from",
							fr: "Le vecteur qui commence de"
						}[lang]
					},
					{
						type: "text",
						text: `(${x1},${y1})`,
						extra: ["mono"]
					},
					{
						type: "text",
						text: { en: "to", fr: "à" }[lang]
					},
					{
						type: "text",
						text: `(${x2},${y2})`,
						extra: ["mono"]
					},
					{
						type: "text",
						text: { en: "is:", fr: "est:" }[lang]
					}
				]
			},
			{
				type: "p",
				content: [
					{
						type: "text",
						text: "\\overrightarrow{AB}",
						extra: ["latex"]
					},
					{
						type: "text",
						text: " = <"
					},
					{
						type: "input",
						id: "x"
					},
					{
						type: "text",
						text: ",",
						extra: ["mono"]
					},
					{
						type: "input",
						id: "y"
					},
					{
						type: "text",
						text: ">",
						extra: ["mono"]
					}
				]
			}
		]
	})
	.setSolutionGenerator(([[x1, y1], [x2, y2]]) => {
		return { x: x2 - x1, y: y2 - y1 }
	})
