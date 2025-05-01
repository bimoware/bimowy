import { ExerciseGenerator, Language, OptionValuesFrom } from "../defs"

type Seed = [x1: number, x2: number, y1: number, y2: number]
type Answers = { x: number; y: number }
const optionDefs = {
	min: {
		type: "number",
		id: "min",
		title: "Minimum",
		defaultValue: 1,
		min: 1
	},
	max: {
		type: "number",
		id: "max",
		title: "Maximum",
		defaultValue: 10,
		max: 10
	}
} as const

const getExercise = (id: string) =>
	new ExerciseGenerator<Seed, Answers, OptionValuesFrom<typeof optionDefs>>({
		id,
		beta: true,
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
		generateSeed() {
			const range = [-9, 9]
			const [x1, y1, x2, y2] = Array(4)
				.fill(range)
				.map((r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0])
			return [x1, y1, x2, y2]
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
							text: "= <",
							extra: ["mono"]
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
		},
		getDetailedSolution(seed: number[]) {
			return [
				{
					type: "p",
					content: [
						{
							type: "text",
							text: "[Solution Here]"
						}
					]
				}
			]
		}
	})

export default getExercise
