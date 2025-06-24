"use client";

import { useEffect, useRef, useState } from "react"
import useSound from "use-sound"
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { ExercisesGenerateRouteResult } from "@api/resources/[id]/generate/route";
import { ExercisesValidateRouteResult } from "@api/resources/[id]/validate/route";
import { ExerciseContext } from "./ExerciseContext";
import { End } from "./End";
import { Options } from "./Options";
import { Title } from "./Title";
import { Buttons } from "./Buttons";
import { LanguageCode } from "@util/locale";
import { ExerciseBuilder } from "@api/lib/exercise";
import { ContextElement, ContextSection } from "@api/lib/context";

export type PageStep = 'options' | 'normal' | 'end'
export type ExerciseData = {
	content: ExercisesGenerateRouteResult[number],
	state: 'normal' | 'correcting' | 'corrected',
	inputs: Record<string, Input>,
}
export type Input = {
	value: string
} & ({
	corrected: false
} | {
	corrected: true,
	correct: boolean,
	correctOnFirstTry: boolean,
	tries: number,
})

export type Exercise = {
	items: ExerciseData[];
	index: number;
}

export default function ExercisePage({ exerciseData, exercise_id, locale }: {
	exerciseData: ReturnType<ExerciseBuilder["serialize"]>
	exercise_id: string
	locale: LanguageCode
}) {
	const [pageStep, setPageStep] = useState<PageStep>('options')
	const [exercises, setExercises] = useState<Exercise>()
	const apiOptions = exerciseData.options
	const defaultOptions = Object.entries(apiOptions).reduce((prev, curr) => ({
		...prev,
		[curr[0]]: curr[1].defaultValue
	}), {} as Record<string, any>)
	const [userOptionValues, setUserOptionValues] = useState<Record<string, any>>(defaultOptions)
	const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.2 }),
		[playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.4 })
	const inputRefs = useRef<Record<string, HTMLInputElement>>({})

	const actions = {
		startExercises: async function () {
			setPageStep('normal')
			return await actions.fetchExercises()
		},
		getAllInputIDs(section: ContextSection | ContextElement) {
			const inputs: string[] = []
			switch (section.type) {
				case 'input':
					inputs.push(section.id)
					break
				case 'p':
					section.content.forEach(content => {
						inputs.push(...actions.getAllInputIDs(content))
					})
					break
			}
			return inputs
		},
		fetchExercises: async function () {
			const url = new URL(`/api/resources/${exercise_id}/generate`, window.location.origin)
			url.searchParams.append('lang', locale)
			const res = await fetch(url, {
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userOptionValues)
			})
			const result = await res.json()
			if (!result.ok) {
				setPageStep('options')
				return alert(result.message)
			}
			const { data }: { data: ExercisesGenerateRouteResult } = result
			setExercises({
				items: data.map((ex) => {
					const inputs: Record<string, Input> = {}
					for (const section of ex.context) {
						for (const id of actions.getAllInputIDs(section)) {
							inputs[id] = {
								value: '',
								corrected: false
							}
						}
					}
					return { content: ex, state: 'normal', inputs }
				}),
				index: 0
			})
		},
		setCurrentExerciseState: function (state: ExerciseData['state']) {
			if (!exercises) throw new Error('No exercises to set state')
			setExercises(prev => {
				if (!prev) throw new Error('No exercises to set state')
				const newItems = [...prev.items]
				const current = { ...newItems[prev.index] }
				current.state = state
				newItems[prev.index] = current
				return { items: newItems, index: prev.index }
			})
		},
		correctExercise: async function () {
			if (!exercises) throw new Error('No exercises to start correcting')
			const exercise = exercises.items[exercises.index]
			actions.setCurrentExerciseState('correcting')

			const answers = Object.fromEntries(
				Object.entries(exercise.inputs).map(([id, input]) => [id, input.value])
			)
			const url = new URL(`/api/resources/${exercise_id}/validate`, window.location.origin)
			url.searchParams.append('id', exercise_id)

			return await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answers, seed: exercise.content.seed })
			})
				.then(res => res.json())
				.then(res => res.data)
				.then((corrections: ExercisesValidateRouteResult) => {
					const isAllCorrect = Object.values(corrections).every(Boolean)
					if (isAllCorrect) playCorrect()
					else playIncorrect()

					actions.setCurrentExerciseState('corrected')

					setExercises(prev => {
						if (!prev) throw new Error('No exercises to apply correction')
						const newItems = [...prev.items]
						const current = { ...newItems[prev.index] }

						for (const id of Object.keys(current.inputs)) {
							const isCorrect = corrections[id]
							const input = current.inputs[id]
							const tries = input.corrected ? input.tries : 0

							current.inputs[id] = {
								corrected: true,
								correct: isCorrect,
								value: input.value,
								correctOnFirstTry: input.corrected
									? input.correctOnFirstTry
									: isCorrect,
								tries: tries + 1
							}
						}

						newItems[prev.index] = current
						return { items: newItems, index: prev.index }
					})
				})
		},
		retryExercise: function () {
			actions.setCurrentExerciseState('normal')
		},
		nextExercise: function () {
			setExercises(prev => {
				if (!prev) throw new Error('No exercises to retry')
				const next = prev.index + 1
				return { ...prev, index: next }
			})
			actions.setCurrentExerciseState('normal')
		},
		end: function () {
			setPageStep('end')
		},
		getInput: function (id: string) {
			return exercises && exercises.items[exercises.index].inputs[id]
		},
		renderNode: function (exercise: ExerciseData, node: ContextElement | ContextSection, key: number) {
			switch (node.type) {
				case 'p':
					return <p key={key} className="*:px-1">
						{node.content.map((subNode, i) => actions.renderNode(exercise, subNode, key + i))
						}</p>
				case 'text':
					return <span
						key={key}
						className={`${node.extra?.includes('mono') && "font-mono"}`}>
						{
							node.extra?.includes('latex')
								? <Latex>{node.text}</Latex>
								: node.text
						}
					</span>
				case 'input':
					const input = actions.getInput(node.id)
					return (
						<input
							type="number"
							ref={ref => { if (ref && !inputRefs.current[node.id]) inputRefs.current[node.id] = ref }}
							key={node.id}
							disabled={exercise.state !== 'normal'}
							onChange={e => {
								const { value } = e.target
								setExercises(prev => {
									if (!prev) throw new Error('No exercises to change input')
									const items = [...prev.items]
									const idx = prev.index
									const ex = { ...items[idx] }
									const inputs = { ...ex.inputs };
									const old = inputs[node.id];
									inputs[node.id] = { ...old, value };
									ex.inputs = inputs;
									items[idx] = ex;
									return { ...prev, items };
								})
							}}
							value={actions.getInput(node.id)?.value || ''}
							className={
								input && input.corrected && (input.correct
									? "!outline-green-500/50 !bg-green-500/10"
									: "!outline-red-500/50") || ""
							}
						/>
					)
				default:
					return <>wtf</>
			}
		},
		focusEmptyOrIncorrectInput() {
			if (!exercises) return
			const exercise = exercises.items[exercises.index]
			if (exercise.state != "normal") return
			const inputs = Object.entries(exercise.inputs)
			const [inputId] = inputs.find(([_, input]) => !input.value)
				|| inputs.find(([_, input]) => input.corrected && !input.correct)
				|| []
			if (!inputId) return
			inputRefs.current[inputId].focus()
		},
		handleEnter: function () {
			if (pageStep == "options") return actions.startExercises()
			if (pageStep == "end") return
			if (!exercises) return
			const exercise = exercises.items[exercises.index]
			if (exercise.state == "normal") {
				const firstEmptyInput = Object.entries(exercise.inputs).find(([, input]) => !input.value)
				if (!firstEmptyInput) return actions.correctExercise()
				actions.focusEmptyOrIncorrectInput()
			} else if (exercise.state == "corrected") {
				const allCorrect = Object.values(exercise.inputs).every(inp => inp.corrected && inp.correct)
				if (!allCorrect) return actions.retryExercise()
				if (exercises.index == exercises.items.length - 1) return actions.end()
				return actions.nextExercise()
			}
		}
	}

	useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (e.key !== "Enter") return
			if ((e.target as HTMLElement).tagName.toLowerCase() === "button") return
			actions.handleEnter()
		}
		window.addEventListener("keydown", handleKey)
		return () => window.removeEventListener("keydown", handleKey)
	}, [actions])

	useEffect(() => {
		if (pageStep !== "normal" || !exercises) return
		actions.focusEmptyOrIncorrectInput()
	}, [exercises?.items[exercises.index].state])

	useEffect(() => { inputRefs.current = {} }, [pageStep, exercises?.index])

	const blocClass = `flex flex-col grow
					space-y-2
				  w-full
				  rounded-3xl
				  py-3 px-5 text-4xl
				  overflow-y-scroll`
	return (
		<div className="w-full h-full flex-col p-4 flex items-center gap-4">
			<Title {...{ pageStep, exercises }} name={exerciseData.name} />
			{pageStep === "options"
				? <div className={blocClass}>
					<Options {...{ apiOptions, userOptionValues, setUserOptionValues }} />
				</div>
				: <div className={`${blocClass} bg-neutral-900`}>
					{pageStep === "end" && exercises
						? <End {...{ exercises }} />
						: <ExerciseContext {...{ inputRefs, exercises, renderNode: actions.renderNode }} />}
				</div>
			}
			<div className="w-full flex gap-4 items-center justify-center">
				<Buttons {...{ pageStep, exercises, apiOptions, actions }} />
			</div>
		</div>
	)
}
