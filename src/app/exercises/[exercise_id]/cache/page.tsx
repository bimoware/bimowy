'use client';

import { GeneratedExercise, APIOption, ContextElement, ContextSection } from "@app/api/defs"
import { useParams } from "next/navigation"
import { JSX, useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import useSound from "use-sound"
import katex from "katex"
import "katex/dist/katex.min.css"

type PageStep = 'options' | 'normal'
type ExerciseState = 'normal' | 'correcting' | 'corrected'
type ExerciseData = {
	content: GeneratedExercise,
	state: ExerciseState,
	inputs: {
		value: string,
		correct: boolean,
		correctOnFirstTry: boolean,
		tries: number
	}[]
}
type UserOption = { id: string, value: any }

export default function ExercisePage() {
	const { exercise_id: exerciseId } = useParams<{ exercise_id: string }>()
	const t = useTranslations('ExercisePage')
	const locale = useLocale()

	const [pageState, setPageState] = useState<PageStep>('options')
	const [exercises, setExercises] = useState<{
		items: ExerciseData[],
		index: number
	}>({ items: [], index: 0 })
	const [name, setName] = useState<string>('')
	const [apiOptions, setAPIOptions] = useState<APIOption[]>()
	const [userOptions, setUserOptions] = useState<UserOption[]>([])
	const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.5 })
	const [playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.5 })
	const inputRefs = useRef<HTMLInputElement[]>([])

	useEffect(() => {
		fetchOptions()
	}, [exerciseId, locale])

	async function fetchOptions() {
		try {
			const res = await fetch(`/api/options`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ exercise_id: exerciseId, lang: locale })
			})
			const data = await res.json()
			setName(data.name)
			setAPIOptions(data.options)
			setUserOptions(data.options.map((opt: APIOption) => ({ id: opt.id, value: opt.default })))
		} catch (error) {
			console.error('Failed to fetch options:', error)
		}
	}

	async function generateExercises() {
		setPageState('normal')
		try {
			const res = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					exercise_id: exerciseId,
					lang: locale,
					options: userOptions
				})
			})
			const data = await res.json()

			const initialExercises: ExerciseData[] = data.exercises.map((ex: GeneratedExercise) => ({
				content: ex,
				state: 'normal',
				inputs: Array(countInputs(ex.context)).fill(null).map(() => ({
					value: '',
					correct: false,
					correctOnFirstTry: false,
					tries: 0
				}))
			}))

			setExercises({ items: initialExercises, index: 0 })
			inputRefs.current = []
		} catch (error) {
			console.error('Failed to generate exercises:', error)
			setPageState('options')
		}
	}

	async function validateCurrent() {
		const currentIndex = exercises.index
		const exercise = exercises.items[currentIndex]
		if (!exercise) return

		setExercises(prev => {
			const newItems = [...prev.items]
			newItems[currentIndex].state = 'correcting'
			return { ...prev, items: newItems }
		})

		try {
			const res = await fetch('/api/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					exercise_id: exerciseId,
					seed: exercise.content.seed,
					answers: exercise.inputs.map(i => i.value)
				})
			})
			const results = await res.json()

			setExercises(prev => {
				const newItems = [...prev.items]
				const current = newItems[currentIndex]

				current.inputs = current.inputs.map((input, i) => {
					const isCorrect = results[i]
					return {
						...input,
						correct: isCorrect,
						correctOnFirstTry: input.tries === 0 ? isCorrect : input.correctOnFirstTry,
						tries: input.tries + 1
					}
				})
				current.state = 'corrected'

				return { ...prev, items: newItems }
			})

			if (results.every(Boolean)) playCorrect()
			else playIncorrect()
		} catch (error) {
			console.error('Validation failed:', error)
			setExercises(prev => {
				const newItems = [...prev.items]
				newItems[currentIndex].state = 'normal'
				return { ...prev, items: newItems }
			})
		}
	}

	function handleInputChange(index: number, value: string) {
		setExercises(prev => {
			const newItems = [...prev.items]
			newItems[prev.index].inputs[index].value = value
			return { ...prev, items: newItems }
		})
	}

	function getProgressString() {
		return exercises.items.map((ex, idx) => {
			if (idx > exercises.index) return '⚪'
			if (ex.state !== 'corrected') return '🟡'

			const allCorrect = ex.inputs.every(i => i.correct)
			const firstTry = ex.inputs.every(i => i.correctOnFirstTry)

			return firstTry ? '🟢' : allCorrect ? '🟠' : '🔴'
		}).join('')
	}

	// Render helpers
	function renderNode(node: ContextElement | ContextSection, key: number): JSX.Element {
		if (node.type === 'text') {
			const html = node.extra?.includes('latex')
				? katex.renderToString(node.text, { throwOnError: false, output: 'mathml' })
				: undefined
			return html ? (
				<span key={key} dangerouslySetInnerHTML={{ __html: html }} />
			) : (
				<span key={key}>{node.text}</span>
			)
		}
		let inputCounter = 0
		if (node.type === 'input') {
			const idx = inputCounter++
			const inputState = currentExercise.inputs[idx]
			return (
				<input
					ref={el => inputRefs.current[idx] = el}
					key={`input-${idx}`}
					value={inputState.value}
					onChange={e => handleInputChange(idx, e.target.value)}
					disabled={currentExercise.state !== 'normal'}
					className={`... ${inputState.correct ? '...' : '...'}`}
				/>
			)
		}
		return <span key={key} />
	}

	if (pageState === 'options') {
		return (
			<div className="options-container">
				<h1>{name}</h1>
				<div className="options-form">
					{apiOptions?.map(opt => (
						<div key={opt.id} className="option-item">
							<label>{opt.title}</label>
							{opt.type === 'boolean' ? (
								<input
									type="checkbox"
									checked={userOptions.find(u => u.id === opt.id)?.value || false}
									onChange={e => setUserOptions(prev =>
										prev.map(u => u.id === opt.id ? { ...u, value: e.target.checked } : u)
									)}
								/>
							) : (
								<input
									type="number"
									value={userOptions.find(u => u.id === opt.id)?.value || opt.default}
									onChange={e => setUserOptions(prev =>
										prev.map(u => u.id === opt.id ? { ...u, value: Number(e.target.value) } : u)
									)}
									min={opt.min}
									max={opt.max}
								/>
							)}
						</div>
					))}
				</div>
				<button onClick={generateExercises}>
					{t('Start')}
				</button>
			</div>
		)
	}

	const currentExercise = exercises.items[exercises.index]
	if (!currentExercise) return null

	return (
		<div className="exercise-container">
			<h1>{name} - {getProgressString()}</h1>

			<div className="exercise-content">
				{currentExercise.content.context.map((section, idx) => (
					<p key={idx}>
						{section.content.map((node, i) => renderNode(node, i))}
					</p>
				))}
			</div>

			<div className="exercise-actions">
				{currentExercise.state === 'normal' && (
					<button onClick={validateCurrent}>
						{t('Confirm')}
					</button>
				)}
				{currentExercise.state === 'corrected' && (
					<>
						{currentExercise.inputs.some(i => !i.correct) ? (
							<button onClick={() => setExercises(prev => ({
								...prev,
								items: prev.items.map((ex, i) =>
									i === prev.index ? { ...ex, state: 'normal' } : ex
								)
							}))}>
								{t('Retry')}
							</button>
						) : exercises.index < exercises.items.length - 1 ? (
							<button onClick={() => setExercises(prev => ({
								...prev,
								index: prev.index + 1
							}))} >
								{t('Next')}
							</button>
						) : (
							<button onClick={() => setPageState("finished")}>
								{t('Finish')}
							</button>
						)}
					</>
				)}
			</div>
		</div >
	)
}

// Helper function from old code
function countInputs(context: ContextSection[]): number {
	let count = 0
	function traverse(nodes: (ContextElement | ContextSection)[]) {
		nodes.forEach(node => {
			if (node.type === 'input') count++
			else if (node.type === 'p') traverse(node.content)
		})
	}
	context.forEach(node => { if (node.type === 'p') traverse(node.content) })
	return count
}