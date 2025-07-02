<<<<<<< Updated upstream:src/app/api/resources/list/vector-norm.ts
<<<<<<< Updated upstream:src/app/api/resources/list/vector-norm.ts
import { ExerciseBuilder } from "@api/lib/exercise"
import { toRounded } from "@api/lib/misc"
import { IntervalOption } from "@api/lib/option"
import { randomFromInterval } from "@/utils/random"
=======
import { toRounded } from "@/lib/extra"
import { ExerciseBuilder, IntervalOption, randomFromInterval } from "@/lib/resources"
>>>>>>> Stashed changes:src/lib/resources/list/vector-norm.ts
=======
import { toRounded } from "@/lib/extra"
import { ExerciseBuilder, IntervalOption, randomFromInterval } from "@/lib/resources"
>>>>>>> Stashed changes:src/lib/resources/list/vector-norm.ts

type Seed = [x: number, y: number]
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

	generateContext([x, y], lang) {
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
