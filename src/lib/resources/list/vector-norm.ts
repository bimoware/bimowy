import { toRounded } from "@/lib/extra"
import { ExerciseBuilder, ExerciseOption, OptionType, randomFromInterval } from "@/lib/resources"

type Seed = [x: number, y: number]
type Answers = { answer: number }

const options = {
	interval: new ExerciseOption({
		type: OptionType.Interval,
		title: {
			en: "Interval of values",
			fr: "Intervalle des valeurs"
		},
		defaultValue: [0, 10]
	})
}

export default new ExerciseBuilder<Seed, Answers, typeof options>({
	id: "vector-norm",
	names: {
		en: "Vector Norm",
		fr: "Norme de vecteur"
	},
	descs: "| <3,4> | = 5",
	tags: ["vectors"],
	options,

	generateSeed({ interval }) {
		return [randomFromInterval(...interval), randomFromInterval(...interval)]
	},

	generateContent([x, y], lang) {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: { en: "The norm of the vector", fr: "La norme du vecteur" }[lang] },
					{ type: "text", text: `<${x},${y}>`, extra: ["mono"] },
					{ type: "text", text: " = " },
					{ type: "input", id: "answer" }
				]
			}
		]
	},

	generateSolution([x, y]) {
		return {
			answer: toRounded(Math.sqrt(x * x + y * y))
		}
	}
})
