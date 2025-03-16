import { exercicePart, ExercicePartType, ExerciceResource } from '../defs'

export default new ExerciceResource(
	'addition',
	null,
	'Taking the sum of multiple numbers',
	['basic-arithmetic'],
	validateAnswers,
	generateInputs,
	getExerciceParts
)

function validateAnswers(
	[n1, n2]: number[],
	[answer1]: {
		id: string
		value: string
	}[]
) {
	return [
		{
			id: answer1.id,
			correct: String(answer1.value) === (n1 + n2).toString()
		}
	]
}

function generateInputs() {
	const range = [1, 10]
	const [n1, n2] = [range, range].map(
		(r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
	)
	return [n1, n2]
}

function getExerciceParts(inputs: number[]): exercicePart[] {
	const [n1, n2] = inputs
	return [
		{
			type: ExercicePartType.Text,
			text: n1 + ' + ' + n2 + ' = '
		},
		{
			type: ExercicePartType.Input,
			id: 'answer'
		}
	]
}
