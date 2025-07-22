import { ExerciseBuilder, ExerciseOption, OptionType, randomFromInterval } from "@/lib/resources"

type Seed = [base: number, power: number]
type Answers = { answer: number }

const options = {
	"interval_base": new ExerciseOption({
		type: OptionType.Interval,
		title: {
			en: "Interval of values for the base",
			fr: "Intervalle des valeurs pour la base"
		},
		defaultValue: [0, 10]
	}),
	"interval_power": new ExerciseOption({
		type: OptionType.Interval,
		title: {
			en: "Interval of values for the power",
			fr: "Intervalle des valeurs pour la puissance"
		},
		defaultValue: [0, 10]
	})
}

export default new ExerciseBuilder<Seed, Answers, typeof options>({
	options,
	id: "power",
	names: {
		en: "Power",
		fr: "Puissance"
	},
	tags: ["arithmetic"],
	descs: "2$^3$ = 8",
	generateSeed({ interval_base, interval_power }) {
		return [
			randomFromInterval(...interval_base),
			randomFromInterval(...interval_power)
		]
	},
	generateContent([base, power]) {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `${base}$^{${power}}$ = `, extra: ["latex"] },
					{ type: "input", id: "answer" }
				]
			}
		]
	},
	generateSolution([n1, n2]) {
		return {
			answer: n1 ** n2
		}
	}
})
