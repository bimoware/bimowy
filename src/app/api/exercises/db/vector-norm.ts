import { randomFromInterval } from "@app/api/util"
import { ExerciseBuilder, IntervalOption } from "../defs"

type Seed = [x: number, y: number]
type Answers = { answer: number }

const solutionGenerator = ([x, y]: Seed) => {
	return {
		answer: Number(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).toFixed(2))
	}
}
export default new ExerciseBuilder<Seed, Answers>("vector-norm")
	.setName({ fr: "Norme de vecteur", en: "Vector Norm" })
	.setDescription({
		fr: "Sa 'longeur'",
		en: "It's 'length'."
	})
	.setTags(["vector", "space"])
	.addOption(
		"interval",
		new IntervalOption({
			title: {
				en: "Interval of values",
				fr: "Intervalle des valeurs"
			},
			defaultValue: [0, 10]
		})
	)
	.setSeedGenerator(({ interval }) => {
		return [randomFromInterval(...interval), randomFromInterval(...interval)]
	})
	.setContextGenerator(([x, y], lang) => {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: {
							en: "The norm of the vector",
							fr: "La norme du vecteur"
						}[lang]
					},
					{
						type: "text",
						text: `<${x},${y}>`,
						extra: ["mono"]
					},
					{
						type: "text",
						text: " = "
					},
					{
						type: "input",
						id: "answer"
					}
				]
			}
		]
	})
	.setSolutionGenerator(solutionGenerator)
	.setAnswersValidator(([x, y], { answer }) => {
		const solution = solutionGenerator([x, y])
		return {
			answer: Math.abs(solution.answer - answer) <= 0.01
		}
	})
