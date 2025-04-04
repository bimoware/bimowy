import { ExerciseGenerator } from './defs'

const db = [
	new ExerciseGenerator({
		id: 'addition',
		tags: ['basic-arithmetic'],
		// validateAnswers
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
					is_correct: String(answer1.value) === (n1 + n2).toString()
				}
			]
		},
		// generateSeed
		generateSeed: function () {
			const range = [1, 10]
			const [n1, n2] = [range, range].map(
				(r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
			)
			return [n1, n2]
		},
		// getContext
		getContext: function ([n1, n2]: number[]) {
			return [`${n1} + ${n2} = ?`]
		},
		// getInputs
		getInputs: function () {
			return [
				{
					id: 'answer',
					type: 'number'
				}
			]
		}
	}),
	new ExerciseGenerator({
		id: 'substraction',
		tags: ['basic-arithmetic'],
		// validateAnswers
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
					is_correct: String(answer1.value) === (n1 - n2).toString()
				}
			]
		},
		// generateSeed
		generateSeed: function () {
			const range = [1, 10]
			const [n1, n2] = [range, range].map(
				(r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
			)
			return [n1, n2]
		},
		// getContext
		getContext: function ([n1, n2]: number[]) {
			return [`${n1} - ${n2} = ?`]
		},
		// getInputs
		getInputs: function () {
			return [
				{
					id: 'answer',
					type: 'number'
				}
			]
		}
	}),
	new ExerciseGenerator({
		id: 'multiplication',
		desc: 'Repeated addition',
		tags: ['basic-arithmetic'],
		recent: true,
		// validateAnswers
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
					is_correct: String(answer1.value) === (n1 * n2).toString()
				}
			]
		},
		// generateSeed
		generateSeed: function () {
			const range = [1, 10]
			const [n1, n2] = [range, range].map(
				(r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
			)
			return [n1, n2]
		},
		// getContext
		getContext: function ([n1, n2]: number[]) {
			return [`${n1} * ${n2} = ?`]
		},
		// getInputs
		getInputs: function () {
			return [
				{
					id: 'answer',
					type: 'number'
				}
			]
		}
	})
]

export default db
