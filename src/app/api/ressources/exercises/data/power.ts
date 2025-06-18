import { ExerciseBuilder, IntervalOption } from "../defs"
import { randomFromInterval } from "@api/util"

type Seed = [base: number, power: number]
type Answers = { answer: number }

export default new ExerciseBuilder<Seed, Answers>("power")
	.setName({
		en: "Power",
		fr: "Puissance"
	})
	.setTags(["arithmetic"])
	.setDescription("2$^3$ = 8")
	.addOption(
		"interval_base",
		new IntervalOption({
			title: {
				en: "Interval of values for the base",
				fr: "Intervalle des valeurs pour la base"
			},
			defaultValue: [0, 10]
		}))
	.addOption(
		"interval_power",
		new IntervalOption({
			title: {
				en: "Interval of values for the power",
				fr: "Intervalle des valeurs pour la puissance"
			},
			defaultValue: [0, 2]
		})
	)
	.setSeedGenerator(({ interval_base, interval_power }) => {
		return [
			randomFromInterval(...interval_base),
			randomFromInterval(...interval_power)
		]
	})
	.setContextGenerator(([base, power] /*, lang*/) => {
		return [
			{
				type: "p",
				content: [
					{ type: "text", text: `${base}$^{${power}}$ = `, extra: ["latex"] },
					{ type: "input", id: "answer" }
				]
			}
		]
	})
	.setSolutionGenerator(([n1, n2]) => {
		return {
			answer: n1 ** n2
		}
	})
