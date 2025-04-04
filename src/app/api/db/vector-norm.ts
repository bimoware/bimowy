import { ExerciseGenerator } from '../defs'

const ex = new ExerciseGenerator({
	id: 'vector-norm',
	tags: ['algebra'],
	createdOn: 17437700880000,
	recent: true,
	generateSeed: function () {
		const range = [-5, 5]
		const [x1, y1, x2, y2] = Array(4)
			.fill(range)
			.map(
				(r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
			)
		return [x1, y1, x2, y2]
	},
	getContext: function ([x1, y1, x2, y2]: number[]) {
		return [
			{
				type: 'p',
				content: [
					{
						type: 'text',
						text: 'The distance between'
					},
					{
						type: 'latex',
						text: `A(${x1},${y1})`
					},
					{
						type: 'text',
						text: 'and'
					},
					{
						type: 'latex',
						text: `B(${x2},${y2})`
					},
					{
						type: 'text',
						text: 'is'
					},
					{
						type: 'input',
						id: 'answer'
					}
				]
			}
		]
	},
	validateAnswers: function (
		[x1, y1, x2, y2]: number[],
		[answer1]: {
			id: string
			value: string
		}[]
	) {
		return [
			{
				id: answer1.id,
				is_correct:
					Number(String(answer1.value)).toPrecision(2) ===
					Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
						.toPrecision(2)
						.toString()
			}
		]
	}
})

export default ex
