import { ExerciseBuilder, IntervalOption } from "../defs"
import { randomFromInterval } from "@api/util"


type Seed = [x: number, y: number]
type Answers = { answer: number }

const exercise = new ExerciseBuilder<Seed, Answers>("vector-norm")
	.setName({ fr: "Norme de vecteur", en: "Vector Norm" })
	.setTags(["vectors"])
	.setDescription('| <3,4> | = 5')
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
	.setSolutionGenerator(([x, y]: Seed) => {
		return {
			answer: Number(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).toFixed(2))
		}
	})

exercise
	.setAnswersValidator(([x, y], { answer }) => {
		const solution = exercise.generateSolution([x, y])
		return {
			answer: Math.abs(solution.answer - answer) <= 0.01
		}
	})

export default exercise