import { ExerciseGenerator, Language, OptionValuesFrom } from "../defs"
import { randomFromRange } from "../util"

type Seed = [x1: number, x2: number, y1: number, y2: number]
type Answers = { x: number; y: number }
const optionDefs = {
	range: {
		type: "range",
		id: "range",
		title: {
			en: "Range of values",
			fr: "Plage des valeurs"
		},
		defaultValue: [-10, 10] as [number, number]
	}
} as const

const getExercise = (id: string) =>
	new ExerciseGenerator<Seed, Answers, OptionValuesFrom<typeof optionDefs>>({
		id,
		nameLocales: {
			en: "Points to vector",
			fr: "Points à vecteur"
		},
		descLocales: {
			en: "Convert 2 points into a vector",
			fr: "Convertir 2 points en un vecteur"
		},
		tags: ["linear-algebra"],
		createdOn: 3,
		optionDefs,
		generateSeed({ range }) {
			return [
				randomFromRange(...range),
				randomFromRange(...range),
				randomFromRange(...range),
				randomFromRange(...range)
			]
		},
		getContext([x1, y1, x2, y2]: Seed, lang: Language) {
			return [
				{
					type: "p",
					content: [
						{
							type: "text",
							text: {
								en: "The vector that goes from",
								fr: "Le vecteur qui commence de"
							}[lang]
						},
						{
							type: "text",
							text: `A(${x1},${y1})`,
							extra: ["mono"]
						},
						{
							type: "text",
							text: { en: "to", fr: "à" }[lang]
						},
						{
							type: "text",
							text: `B(${x2},${y2})`,
							extra: ["mono"]
						},
						{
							type: "text",
							text: { en: "is:", fr: "est:" }[lang]
						}
					]
				},
				{
					type: "p",
					content: [
						{
							type: "text",
							text: "\\overrightarrow{AB}",
							extra: ["latex"]
						},
						{
							type: "text",
							text: " = <"
						},
						{
							type: "input",
							id: "x"
						},
						{
							type: "text",
							text: ",",
							extra: ["mono"]
						},
						{
							type: "input",
							id: "y"
						},
						{
							type: "text",
							text: ">",
							extra: ["mono"]
						}
					]
				}
			]
		},
		validateAnswers([x1, x2, y1, y2]: Seed, { x, y }: Answers) {
			const solution = this.getSolution([x1, x2, y1, y2])
			return {
				x: x == solution.x,
				y: y == solution.y
			}
		},
		getSolution([x1, y1, x2, y2]: Seed) {
			return { x: x2 - x1, y: y2 - y1 }
		}
	})

export default getExercise
