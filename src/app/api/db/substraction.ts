import { ExerciseGenerator } from '../defs'

const ex = new ExerciseGenerator({
	id: 'substraction',
	tags: ['basic-arithmetic'],
	createdOn: 1740918618000,
	generateSeed: function () {
		const range = [1, 10]
		const [n1, n2] = Array(2)
			.fill(range)
			.map(
				(r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
			)
		return [n1, n2]
	},
	getContext: function ([n1, n2]: number[]) {
		return [
			{
				type: 'p',
				content: [
					{
						type: 'text',
						text: `${n1} - ${n2} = `
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
		[n1, n2]: number[],
		[answer1]: {
			id: string
			value: string
		}[]
	) {
		return [
			{
				id: answer1.id,
				is_correct:
					String(answer1.value) === (n1 - n2).toString()
			}
		]
	}
})

export default ex
