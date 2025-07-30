import { useTranslations } from "next-intl"
import { Button } from "./Button"
import { correctExercise, end, GeneratedExerciseCtx, nextExercise, retryExercise, startExercises, UngeneratedExerciseCtx } from "./extra"

export function Buttons(ctx: UngeneratedExerciseCtx | GeneratedExerciseCtx) {
	const t = useTranslations('ResourcePage')
	switch (ctx.state.step) {
		case 'options':
			if (!ctx.state.apiOptions) return <Button
			alt={t('LoadingOptions')}
			disabled
			/>
			else return <Button
			alt={t('Start')}
			src='/svgs/start.svg'
			onClick={() => startExercises(ctx as UngeneratedExerciseCtx)}
			primary
			/>
		case 'normal':
			if (!ctx.state.exercises) return <Button alt={t('LoadingExercises')} disabled />
			const exercise = ctx.state.exercises[ctx.state.index]
			switch (exercise.state) {
				case 'normal':
					const allInputsFilled = Object.values(exercise.inputs).every(inp => typeof inp.value != "undefined")
					return <Button
					alt={t('Confirm')}
					src='/svgs/check.svg'
					{...(
						allInputsFilled
							? { onClick: () => correctExercise(ctx as GeneratedExerciseCtx), primary: true }
							: { disabled: true }
					)} />
				case 'correcting':
					return <Button
					alt={t('Correcting')}
					disabled
					/>
				case 'corrected':
					const allCorrect = Object.values(exercise.inputs).every(input => input.corrected && input.correct)
					const isLast = ctx.state.index < ctx.state.exercises.length - 1
					return <>
						{
						!allCorrect
						&& (
							<Button
								alt={t('TryAgain')}
								src='/svgs/undo.svg'
								onClick={() => retryExercise(ctx as GeneratedExerciseCtx)}
								primary
							/>
						)}

						<Button
							alt={
								isLast
									? allCorrect ? t('Next') : t('Abandon')
									: t('Finish')
							}
							src={isLast ? '/svgs/next.svg' : '/svgs/end.svg'}
							onClick={isLast
								? () => nextExercise(ctx as GeneratedExerciseCtx)
								: () => end(ctx as GeneratedExerciseCtx)}
						/>
					</>

			}
	}
}