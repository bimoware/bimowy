import { ExerciseResource } from './defs'

const db = [
	new ExerciseResource(
		'addition',
		'Addition',
		'Taking the sum of multiple numbers',
		['basic-arithmetic'],
		// validateAnswers
		function (
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
		function () {
			const range = [1, 10]
			const [n1, n2] = [range, range].map(
				(r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
			)
			return [n1, n2]
		},
		// getContext
		function ([n1, n2]: number[]) {
			return [`${n1} + ${n2} = ?`]
		},
		// getInputs
		function () {
			return [
				{
					id: 'answer',
					type: 'number'
				}
			]
		}
	),
	new ExerciseResource(
		'substraction',
		'Substraction',
		'Taking the difference of two numbers',
		['basic-arithmetic'],
		// validateAnswers
		function (
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
		function () {
			const range = [1, 10]
			const [n1, n2] = [range, range].map(
				(r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
			)
			return [n1, n2]
		},
		// getContext
		function ([n1, n2]: number[]) {
			return [`${n1} - ${n2} = ?`]
		},
		// getInputs
		function () {
			return [
				{
					id: 'answer',
					type: 'number'
				}
			]
		}
	)
]

export default db
