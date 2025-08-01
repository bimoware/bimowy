import { ExerciseResourceBuilder, ExerciseOption, OptionType, randomFromInterval } from "@/lib/resources"

type Seed = [[x1: number, y1: number], [x2: number, y2: number]]
type Answers = { x: number; y: number }

const options = {
	interval: new ExerciseOption({
		type: OptionType.Interval,
		title: {
			en: "Range of values",
			fr: "Plage des valeurs"
		},
		defaultValue: [-10, 10]
	})
}

export default new ExerciseResourceBuilder<Seed, Answers, typeof options>({
	id: "points-to-vector",
	names: {
		en: "Points to vector",
		fr: "Points à vecteur"
	},
	descs: {
		en: "From (1,1) to (7,4) = <6,3>",
		fr: "De (1,1) à (7,4) = <6,3>"
	},
	tags: ["plane", "vectors"],
	options,

	generateSeed({ interval }) {
		return [
			[randomFromInterval(...interval), randomFromInterval(...interval)],
			[randomFromInterval(...interval), randomFromInterval(...interval)]
		]
	},

	generateContent([[x1, y1], [x2, y2]], lang) {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: { en: "The vector that goes from", fr: "Le vecteur qui commence de" }[lang] },
					{ type: "text", text: `(${x1},${y1})`, extra: ["mono"] },
					{ type: "text", text: { en: "to", fr: "à" }[lang] },
					{ type: "text", text: `(${x2},${y2})`, extra: ["mono"] },
					{ type: "text", text: { en: "is:", fr: "est:" }[lang] }
				]
			},
			{
				type: "p",
				content: [
					{ type: "text", text: "\\overrightarrow{AB}", extra: ["latex"] },
					{ type: "text", text: " = <" },
					{ type: "input", id: "x" },
					{ type: "text", text: ",", extra: ["mono"] },
					{ type: "input", id: "y" },
					{ type: "text", text: ">", extra: ["mono"] }
				]
			}
		]
	},

	generateSolution([[x1, y1], [x2, y2]]) {
		return {
			x: x2 - x1,
			y: y2 - y1
		}
	}
})
