import { Exercise } from "./ExercisePage"

type ExerciseInputCorrection = { emoji: string, score: number, extra?: string }

export function getExerciseCorrections(exercises: Exercise) {
	const data = {
		total: 0,
		subtotal: 0,
		exactScore: "",
		score: 0,
		texts: [] as ExerciseInputCorrection[][],
		worthShowing: false,
	}

	const items = exercises.items.map(item => {
		data.total += 1

		const inputs = Object.values(item.inputs)
		let exerciseSubTotal = 0
		const exerciseTexts = inputs.map(input => {
			const exerciseText: ExerciseInputCorrection = input.corrected
				? (
					input.correct
						? (
							input.correctOnFirstTry
								? { emoji: "🟩", score: 1 }
								: { emoji: "🟨", score: 0.5, extra: `(${input.tries} tries)` }
						)
						: { emoji: "🟥", score: 0 }
				)
				: { emoji: "⬜", score: 0, extra: `Not corrected once yet.` }

			exerciseSubTotal += exerciseText.score
			return exerciseText
		})

		data.subtotal += exerciseSubTotal / inputs.length
		return exerciseTexts
	})

	data.texts = items
	data.score = data.subtotal / data.total
	data.worthShowing = exercises.items.length > 10 && data.score != 0 && data.score != 1
	data.exactScore = Math.round(data.score * 100) + "%"
	return data
}