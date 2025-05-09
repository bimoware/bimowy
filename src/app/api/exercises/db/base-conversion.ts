import { ExerciseBuilder, NumberOption, RadioOption } from "../defs"
import { randomFromInterval } from "../../util"

const bases = ["binary", "decimal", "hexadecimal"] as const
type Base = (typeof bases)[number]

type Seed = [n: string, from: Base, to: Base]
type Answers = { answer: string }

export default new ExerciseBuilder<Seed, Answers>("base-conversion")
	.setName({
		en: "Base conversion",
		fr: "Conversion de base numérique"
	})
	.setTags([...bases])
	.addOption(
		"max",
		new NumberOption({
			defaultValue: 2 ** 12,
			title: {
				en: "Maximum",
				fr: "Maximum"
			},
			min: 0
		})
	)
	.addOption(
		"from",
		new RadioOption({
			defaultValue: bases[0],
			title: {
				en: "From",
				fr: "De"
			},
			options: [...bases]
		})
	)
	.addOption(
		"to",
		new RadioOption({
			defaultValue: bases[0],
			title: {
				en: "To",
				fr: "À"
			},
			options: [...bases]
		})
	)
	.setSeedGenerator(({ max, from, to }) => {
		const n = randomFromInterval(0, max)
		return [
			n
				.toString({ binary: 2, decimal: 10, hexadecimal: 16 }[from as Base])
				.toUpperCase(),
			from as Base,
			to as Base
		]
	})
	.setContextGenerator(([n, from, to], lang) => {
		const fixedBases = {
			en: {
				decimal: "decimal",
				binary: "binary",
				hexadecimal: "hexadecimal"
			},
			fr: {
				decimal: "décimal",
				binary: "binaire",
				hexadecimal: "héxadecimal"
			}
		}[lang]
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: {
							fr: `Convertis`,
							en: `Convert`
						}[lang]
					},
					{
						type: "text",
						text: `${n}`,
						extra: ["mono"]
					},
					{
						type: "text",
						text: `(${fixedBases[from]})`
					},
					{
						type: "text",
						text: `to ${fixedBases[to]}: `
					},
					{
						type: "input",
						id: "answer"
					}
				]
			}
		]
	})
	.setSolutionGenerator(([n, from, to]) => {
		const baseRadix = {
			binary: 2,
			decimal: 10,
			hexadecimal: 16
		}
		const originalN = parseInt(n, baseRadix[from])
		const answer = originalN.toString(baseRadix[to])
		return { answer }
	})
