import { ExerciseGenerator, Language } from "../defs"

type Seed = [x1: number, x2: number, y1: number, y2: number]
type Answers = { x: number; y: number }

const ex = new ExerciseGenerator<Seed, Answers>({
	id: "from-points-to-vector",
	nameLocales: {
		en: "Points to vector",
		fr: "Points à vecteur",
	},
	descLocales: {
		en: "Convert 2 points into a vector",
		fr: "Convertir 2 points en un vecteur",
	},
	tags: ["linear-algebra"],
	createdOn: 4,
	generateSeed: function () {
		const range = [-9, 9]
		const [x1, y1, x2, y2] = Array(4)
			.fill(range)
			.map((r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0])
		return [x1, y1, x2, y2]
	},
	getContext: function ([x1, y1, x2, y2]: number[], lang: Language) {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: {
							en: "The vector that goes from",
							fr: "Le vecteur qui commence de",
						}[lang],
					},
					{
						type: "text",
						text: `A(${x1},${y1})`,
						extra: ["mono"],
					},
					{
						type: "text",
						text: { en: "to", fr: "à" }[lang],
					},
					{
						type: "text",
						text: `B(${x2},${y2})`,
						extra: ["mono"],
					},
					{
						type: "text",
						text: { en: "is:", fr: "est:" }[lang],
					},
				],
			},
			{
				type: "p",
				content: [
					{
						type: "text",
						text: "\\overrightarrow{AB}",
						extra: ["latex"],
					},
					{
						type: "text",
						text: "= <",
						extra: ["mono"],
					},
					{
						type: "input",
						id: "x",
					},
					{
						type: "text",
						text: ",",
						extra: ["mono"],
					},
					{
						type: "input",
						id: "y",
					},
					{
						type: "text",
						text: ">",
						extra: ["mono"],
					},
				],
			},
		]
	},
	validateAnswers: function ([x1, x2, y1, y2]: Seed, { x, y }: Answers) {
		const solution = this.getSolution([x1, x2, y1, y2])
		return {
			x: x == solution.x,
			y: y == solution.y,
		}
	},
	getSolution: function ([x1, y1, x2, y2]: number[]) {
		return { x: x2 - x1, y: y2 - y1 }
	},
	getDetailedSolution: function (seed: number[]) {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: "[Solution Here]",
					},
				],
			},
		]
	},
})

export default ex
