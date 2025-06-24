import { useTranslations } from "next-intl"
import { Button } from "./Button"
import { Exercise, PageStep } from "./ExercisePage"
import { ExerciseBuilder } from "@api/lib/exercise"

export function Buttons({ pageStep, exercises, apiOptions, actions }: {
	pageStep: PageStep,
	exercises?: Exercise,
	apiOptions?: ReturnType<ExerciseBuilder["serialize"]>["options"],
	actions: {
		startExercises: () => Promise<void>
		correctExercise: () => Promise<void>
		retryExercise: () => void
		nextExercise: () => void,
		end: () => void
	}
}) {
	const t = useTranslations('Buttons')
	switch (pageStep) {
		case 'options':
			if (apiOptions) return <Button alt={t('Start')} src='/svgs/start.svg' onClick={actions.startExercises} primary />
			else return <Button alt={t('LoadingOptions')} disabled />
		case 'normal':
			if (!exercises) return <Button alt={t('LoadingExercises')} disabled />
			const exercise = exercises.items[exercises.index]
			switch (exercise.state) {
				case 'normal':
					if (Object.values(exercise.inputs).every(inp => inp.value)) return <Button alt={t('Confirm')} src='/svgs/check.svg' onClick={actions.correctExercise} primary />
					else return <Button alt={t('Confirm')} src='/svgs/check.svg' disabled />
				case 'correcting':
					return <Button alt={t('Correcting')} disabled />
				case 'corrected':
					const allCorrect = Object.values(exercise.inputs).every(input => input.corrected && input.correct)
					const isLast = exercises.index < exercises.items.length - 1
					return <>
						{!allCorrect && (
							<Button alt={t('TryAgain')} src='/svgs/undo.svg' onClick={actions.retryExercise} primary />
						)}

						<Button
							alt={
								isLast
									? t(allCorrect ? 'Next' : 'Abandon')
									: t('Finish')
							}
							src={isLast ? '/svgs/next.svg' : '/svgs/end.svg'}
							onClick={isLast ? actions.nextExercise : actions.end}
						/>
					</>

			}
	}
}