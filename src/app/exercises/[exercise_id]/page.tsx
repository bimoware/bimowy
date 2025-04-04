'use client';

import { ExerciseInput, GeneratedExercise } from '@app/api/defs'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Bloc } from '@cpn/Bloc'
import useSound from 'use-sound'

type PageState =
	| 'not-yet'
	| 'answering'
	| 'correcting'
	| 'corrected'
	| 'finished'

type ExerciseData = { name: string; desc: string; id: string }

type ExerciseCorrection = { id: string; is_correct: boolean }

export default function ExercisePage() {
	const params = useParams()
	const exerciseId = params['exercise_id']!

	const [exercises, setExercises] = useState<GeneratedExercise[]>([])
	const [pageState, setPageState] = useState<PageState>('not-yet')
	const [exerciseData, setExerciseData] = useState<ExerciseData>()
	const [exerciseIndex, setExerciseIndex] = useState<number>(0)
	const [corrections, setCorrections] = useState<
		Array<{ correctOnFirstTry: boolean; correct: boolean } | null>
	>([])
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])

	const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.5 })
	const [playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.5 })

	// Generate questions
	useEffect(() => {
		fetch('/api/generate/', {
			method: 'POST',
			body: JSON.stringify({ exercise_id: exerciseId })
		})
			.then((res) => res.json())
			.then((res) => {
				const { name, desc, id, exercises: generatedExercises } = res
				setExerciseData({ name, desc, id })
				setExercises(generatedExercises)
			})
	}, [exerciseId])

	useEffect(() => {
		if (pageState != 'corrected') return
		const allCorrect = corrections.every((c) => c?.correct)
		if (allCorrect) playCorrect()
		else playIncorrect()
	}, [pageState])

	// Focus the first incorrect input when pageState becomes "answering"
	useEffect(() => {
		if (pageState === 'answering') {
			// Give React time to populate refs after render
			const timer = setTimeout(focusFirstIncorrectInput, 10)
			return () => clearTimeout(timer)
		}
	}, [pageState, exerciseIndex]) // Add exerciseIndex to dependenc

	// Keyboard handler
	useEffect(() => {
		function handleEnter(e: KeyboardEvent) {
			if (e.key !== 'Enter') return
			if (pageState === 'not-yet') return startExercises()
			if (pageState === 'answering') return startCorrection()
			if (pageState === 'corrected') {
				const allCorrect = corrections.every((c) => c?.correct)
				if (!allCorrect) return tryAgain()
				if (exerciseIndex < exercises.length - 1) return nextExercise()
				return endQuiz()
			}
		}

		window.addEventListener('keydown', handleEnter)
		return () => window.removeEventListener('keydown', handleEnter)
	}, [pageState, corrections, exerciseIndex, exercises.length])

	function focusFirstIncorrectInput() {
		const firstIncorrectIndex =
			corrections.length > 0 ? corrections.findIndex((c) => !c?.correct) : 0
		if (firstIncorrectIndex === -1) return
		const input = inputRefs.current[firstIncorrectIndex]
		if (!input) return
		input.focus()
		input.select()
	}

	function startExercises() {
		setPageState('answering')
		setExerciseIndex(0)
		setCorrections([])
		inputRefs.current = []
	}

	function nextExercise() {
		setPageState('answering')
		setExerciseIndex((prev) => prev + 1)
		setCorrections([])
		inputRefs.current = []
	}

	function handleCorrection(res: ExerciseCorrection[]) {
		setCorrections((prev) =>
			res.map((answer, i) => {
				const currentCorrection = prev[i]
				return {
					correct: answer.is_correct,
					correctOnFirstTry:
						currentCorrection?.correctOnFirstTry ?? answer.is_correct
				}
			})
		)
		setPageState('corrected')
	}

	function startCorrection() {
		setPageState('correcting')
		const exercise = exercises[exerciseIndex]
		if (!exercise) return

		const answers = exercise.inputs.map((input, index) => ({
			id: input.id,
			value: inputRefs.current[index]?.value
		}))

		fetch('/api/validate/', {
			method: 'POST',
			body: JSON.stringify({
				exercise_id: exerciseId,
				answers,
				seed: exercise.seed
			})
		})
			.then((res) => res.json())
			.then(handleCorrection)
	}

	function tryAgain() {
		setCorrections([])
		setPageState('answering')
	}
	function getIsInputDisabled(index: number) {
		const correction = corrections[index]
		if (!correction) return false
		if (pageState !== 'answering') return true
		return correction.correctOnFirstTry || correction.correct
	}

	function endQuiz() {
		setPageState('finished')
	}

	if (pageState === 'finished')
		return (
			<Bloc type='full-body'>
				<div className='flex gap-4 justify-center items-center'>
					<span className='font-bold text-5xl'>Finished!</span>
					<Image
						src={'/media/cat.gif'}
						width={200}
						height={200}
						className='h-8 w-fit aspect-square'
						alt={'Cat vibing'}
					/>
				</div>
			</Bloc>
		)

	return (
		<div className='grow flex m-4 gap-4'>
			<div className='grow-2 flex flex-col items-center'>
				<Title {...{ exerciseData, exercises, exerciseIndex, pageState }} />
				<div className='grow w-full bg-neutral-900 rounded-3xl p-4'>
					<Context {...{ exerciseData, exercises, exerciseIndex, pageState }} />
				</div>
			</div>
			<div className='grow h-full bg-neutral-900 rounded-3xl p-4'>
				<Controls
					{...{
						exerciseData,
						exercises,
						pageState,
						exerciseIndex,
						inputRefs,
						corrections,
						actions: {
							focusFirstIncorrectInput,
							startExercises,
							nextExercise,
							startCorrection,
							endQuiz,
							tryAgain,
							getIsInputDisabled
						}
					}}
				/>
			</div>
		</div>
	)
}

function Controls({
	exerciseData,
	exercises,
	pageState,
	exerciseIndex,
	inputRefs,
	corrections,
	actions
}: {
	exerciseData: ExerciseData | undefined
	exercises: GeneratedExercise[]
	pageState: PageState
	exerciseIndex: number
	inputRefs: React.RefObject<(HTMLInputElement | null)[]>
	corrections: Array<{ correctOnFirstTry: boolean; correct: boolean } | null>
	actions: {
		focusFirstIncorrectInput: () => void
		startExercises: () => void
		nextExercise: () => void
		startCorrection: () => void
		endQuiz: () => void
		getIsInputDisabled: (index: number) => boolean
		tryAgain: () => void
	}
}) {
	if (!exerciseData) return null

	if (pageState === 'not-yet')
		return (
			<Button
				name='Start'
				icon='/svgs/start.svg'
				onClick={actions.startExercises}
			/>
		)

	const currentExercise = exercises[exerciseIndex]
	if (!currentExercise) return null

	return (
		<div className='flex flex-col gap-4'>
			{currentExercise.inputs.map((input, index) => (
				<Input
					key={exerciseIndex + '-' + input.id}
					input={input}
					ref={(el) => (inputRefs.current[index] = el)}
					disabled={actions.getIsInputDisabled(index)}
					correction={corrections[index]}
				/>
			))}

			{pageState === 'answering' && (
				<Button
					name='Correct'
					icon='/svgs/check.svg'
					onClick={actions.startCorrection}
				/>
			)}

			{pageState === 'corrected' && corrections.some((c) => !c?.correct) && (
				<Button
					name='Try again'
					icon='/svgs/undo.svg'
					onClick={() => actions.tryAgain()}
				/>
			)}

			{pageState === 'corrected' &&
				(exerciseIndex === exercises.length - 1 ? (
					<Button name='End' icon='/svgs/end.svg' onClick={actions.endQuiz} />
				) : (
					<Button name='Next' icon='/svgs/next.svg' onClick={actions.nextExercise} />
				))}
		</div>
	)
}

function Input({
	input,
	ref,
	disabled,
	correction
}: {
	input: ExerciseInput
	ref: (instance: HTMLInputElement | null) => void
	disabled: boolean
	correction?: { correctOnFirstTry: boolean; correct: boolean } | null
}) {
	return (
		<div className='flex'>
			<input
				ref={ref}
				id={input.id} // Remove exerciseIndex from ID
				disabled={disabled}
				className='text-center field-sizing-content resize-none focus:outline-0
                    bg-neutral-800 p-2 rounded-xl text-xl w-fit min-w-10'
			/>
			{correction && (
				<Image
					src={correction.correct ? '/svgs/check.svg' : '/svgs/x.svg'}
					alt='Incorrect'
					width={50}
					height={50}
					className='w-fit aspect-square p-2'
				/>
			)}
		</div>
	)
}

function Button({
	name,
	icon,
	onClick
}: {
	name: string
	icon: string
	onClick: () => void
}) {
	return (
		<button className='flex gap-1' onClick={onClick}>
			<Image
				src={icon}
				alt={name}
				width={50}
				height={50}
				className='w-fit aspect-square'
			/>
			<span>{name}</span>
		</button>
	)
}

// Rest of Context and Title components remain the same as original
function Context({
	exerciseData,
	exercises,
	exerciseIndex,
	pageState
}: {
	exerciseData: ExerciseData | undefined
	exercises: GeneratedExercise[]
	exerciseIndex: number
	pageState: PageState
}) {
	if (!exercises.length) return <>Loading exercises...</>
	if (!exercises[exerciseIndex])
		return <>Exercice at position {exerciseIndex + 1} not found (?)</>
	if (pageState == 'not-yet') return <>Ready when you are!</>
	return exerciseData ? (
		exercises[exerciseIndex].context.map((text, i) => <h1 key={i}>{text}</h1>)
	) : (
		<></>
	)
}

// The title on top of the context of the exercise
// Shows the name (& on hover the description), the number of questions and on what question we are
function Title({
	exerciseData,
	exercises,
	exerciseIndex,
	pageState
}: {
	exerciseData: ExerciseData | undefined
	exercises: GeneratedExercise[]
	exerciseIndex: number
	pageState: PageState
}) {
	return exerciseData ? (
		<h1 className='mt-2 ml-4' title={exerciseData.desc}>
			{exerciseData.name}
			{!exerciseData ? (
				<></>
			) : pageState == 'not-yet' ? (
				` - ${exercises.length} Questions`
			) : (
				` - Question ${exerciseIndex + 1}/${exercises.length}`
			)}
		</h1>
	) : (
		<></>
	)
}
