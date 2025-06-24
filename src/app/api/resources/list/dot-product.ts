import { ExerciseBuilder } from "@api/lib/exercise"
import { IntervalOption } from "@api/lib/option"
import { randomFromInterval } from "@util/random"

type Seed = [[x1: number, y1: number], [x2: number, y2: number]]
type Answers = { answer: number }

const options = {
	interval: new IntervalOption({
		title: {
			en: "Interval of values",
			fr: "Intervalle des valeurs"
		},
		defaultValue: [0, 10]
	})
}

export default new ExerciseBuilder<Seed, Answers, typeof options>({
	id: "dot-product",
	names: {
		en: "Dot product",
		fr: "Produit scalaire"
	},
	descs: "<1, 2> ⋅ <3, 4> = 11",
	tags: ["vectors"],
	options,

	generateSeed({ interval }) {
		return [
			[randomFromInterval(...interval), randomFromInterval(...interval)],
			[randomFromInterval(...interval), randomFromInterval(...interval)]
		]
	},

	generateContext([[x1, y1], [x2, y2]]) {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `<${x1},${y1}> ⋅ <${x2},${y2}> = ` },
					{ type: "input", id: "answer" }
				]
			}
		]
	},

	generateSolution([[x1, y1], [x2, y2]]) {
		return {
			answer: x1 * x2 + y1 * y2
		}
	}
})
