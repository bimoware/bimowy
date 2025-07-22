import { useTranslations } from "next-intl"
import { Button } from "./Button"
import { correctExercise, end, GeneratedExerciseState, nextExercise, retryExercise, startExercises, VFXPlayers } from "./extra"

export function Buttons({ state, vfxPlayers }: {
	state: GeneratedExerciseState,
	vfxPlayers: VFXPlayers
}) {
	const t = useTranslations('ResourcePage')
	switch (state.step) {
		case 'options':
			if (!state.apiOptions) return <Button alt={t('LoadingOptions')} disabled />
			else return <Button alt={t('Start')} src='/svgs/start.svg' onClick={() => startExercises()} primary />
		case 'normal':
			if (!state.exercises) return <Button alt={t('LoadingExercises')} disabled />
			const exercise = state.exercises[state.index]
			switch (exercise.state) {
				case 'normal':
					const allInputsFilled = Object.values(exercise.inputs).every(inp => inp.value)
					return <Button alt={t('Confirm')} src='/svgs/check.svg'
						{...(
							allInputsFilled
								? { onClick: () => correctExercise({ vfxPlayers }), primary: true }
								: { disabled: true }
						)} />
				case 'correcting':
					return <Button alt={t('Correcting')} disabled />
				case 'corrected':
					const allCorrect = Object.values(exercise.inputs).every(input => input.corrected && input.correct)
					const isLast = state.index < state.exercises.length - 1
					return <>
						{!allCorrect && (
							<Button alt={t('TryAgain')} src='/svgs/undo.svg' onClick={retryExercise} primary />
						)}

						<Button
							alt={
								isLast
									? allCorrect ? t('Next') : t('Abandon')
									: t('Finish')
							}
							src={isLast ? '/svgs/next.svg' : '/svgs/end.svg'}
							onClick={isLast ? nextExercise : end}
						/>
					</>

			}
	}
}