import { ExerciseBuilder } from "@api/lib/exercise"
import { IntervalOption, NumberOption } from "@api/lib/option"
import { randomFromInterval } from "@/utils/random"

type Seed = number[]
type Answers = { answer: Seed[number] }

const options = {
	interval: new IntervalOption({
		title: {
			en: "Interval of values",
			fr: "Intervalle des valeurs"
		},
		defaultValue: [0, 10]
	}),
	n_values: new NumberOption({
		title: {
			en: "Number of values",
			fr: "Nombre de valeurs"
		},
		defaultValue: 4,
		min: 2
	})
}

export default new ExerciseBuilder<Seed, Answers, typeof options>({
	id: "median",
	names: {
		en: "Median",
		fr: "Mediane"
	},
	descs: {
		en: "Median of [2, 2, 3, 9] = 2.5",
		fr: "Medianne de [2, 2, 3, 9] = 2.5"
	},
	tags: ["lists"],
	options,

	generateSeed({ interval, n_values }) {
		return Array.from({ length: n_values }).map(() => randomFromInterval(...interval))
	},

	generateContext(ns, lang) {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: { en: "Median of", fr: "La medianne de" }[lang] },
					{ type: "text", text: `[ ${ns.join(", ")} ]` },
					{ type: "text", text: { en: "is ", fr: "est " }[lang] },
					{ type: "input", id: "answer" }
				]
			}
		]
	},

	generateSolution(ns) {
		const sortedNs = ns.slice().sort((a, b) => a - b)
		const n = sortedNs.length
		const middleI = Math.floor((n - 1) / 2)
		return {
			answer: n % 2 === 0
				? (sortedNs[middleI] + sortedNs[middleI + 1]) / 2
				: sortedNs[middleI]
		}
	}
})
