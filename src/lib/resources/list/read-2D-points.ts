import { ExerciseBuilder, randomNonZeroInt } from "@/lib/resources"

type Seed = [x: number, y: number]
type Answers = { x: number, y: number }

const options = {}

export default new ExerciseBuilder<Seed, Answers, typeof options>({
	options,
	id: "read-2D-points",
	names: {
		en: "2D Point coordinates",
		fr: "Les coordonées 2D d'un point"
	},
	tags: ["plane"],
	descs: "(?,?)",
	generateSeed() {
		return [randomNonZeroInt(-6, 6), randomNonZeroInt(-6, 6)]
	},
	generateContent([x, y]) {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: "The coordinates of A are x="
					},
					{
						type: "input",
						id: "x"
					},
					{
						type: "text",
						text: " and y="
					},
					{
						type: "input",
						id: "y"
					}
				]
			},
			{
				type: "widget",
				id: "Plane",
				props: {
					ranges: {
						x: { min: -7, max: 7 },
						y: { min: -7, max: 7 }
					},
					elems: [
						{
							type: "point",
							id: "A",
							x,
							y
						}
					]
				}
			}
		]
	},
	generateSolution([n1, n2]) {
		return { x: n1, y: n2 }
	}
})
