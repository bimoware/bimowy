"use client";

import { useCallback, useEffect, useRef, useState } from "react"
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
<<<<<<< Updated upstream
import { LanguageCode } from "@/utils/locale";
import { ExerciseBuilder } from "@api/lib/exercise";
import { ContextElement, ContextSection } from "@api/lib/context";
=======
import { LanguageCode } from "@/lib/locale";
import { ContextElement, ContextSection, ExerciseBuilder } from "@/lib/resources";
>>>>>>> Stashed changes

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
	}), {} as Record<string, unknown>)
	const [userOptionValues, setUserOptionValues] = useState<Record<string, unknown>>(defaultOptions)
	const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.2 }),
		[playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.4 })
	const inputRefs = useRef<Record<string, HTMLInputElement>>({})

	const getAllInputIDs = useCallback((section: ContextSection | ContextElement) => {
		const inputs: string[] = []
		switch (section.type) {
			case 'input':
				inputs.push(section.id)
				break
			case 'p':
				section.content.forEach(content => {
					inputs.push(...getAllInputIDs(content))
				})
				break
		}
		return inputs
	}, [])

	const fetchExercises = useCallback(async () => {
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
					for (const id of getAllInputIDs(section)) {
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
	}, [exercise_id, getAllInputIDs, locale, userOptionValues])

	const startExercises = useCallback(async () => {
		setPageStep('normal')
		return await fetchExercises()
	}, [fetchExercises])

	const setCurrentExerciseState = useCallback((state: ExerciseData['state']) => {
		if (!exercises) throw new Error('No exercises to set state')
		setExercises(prev => {
			if (!prev) throw new Error('No exercises to set state')
			const newItems = [...prev.items]
			const current = { ...newItems[prev.index] }
			current.state = state
			newItems[prev.index] = current
			return { items: newItems, index: prev.index }
		})
	}, [exercises])

	const correctExercise = useCallback(async () => {
		if (!exercises) throw new Error('No exercises to start correcting')
		const exercise = exercises.items[exercises.index]
		setCurrentExerciseState('correcting')

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

				setCurrentExerciseState('corrected')

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
	}, [exercise_id, exercises, playCorrect, playIncorrect, setCurrentExerciseState])

	const retryExercise = useCallback(() => {
		setCurrentExerciseState('normal')
	}, [setCurrentExerciseState])

	const nextExercise = useCallback(() => {
		setExercises(prev => {
			if (!prev) throw new Error('No exercises to retry')
			const next = prev.index + 1
			return { ...prev, index: next }
		})
		setCurrentExerciseState('normal')
	}, [setCurrentExerciseState])

	function end() {
		setPageStep('end')
	}


	const focusEmptyOrIncorrectInput = useCallback(() => {
		if (!exercises) return
		const exercise = exercises.items[exercises.index]
		if (exercise.state != "normal") return
		const inputs = Object.entries(exercise.inputs)
		const [inputId] = inputs.find(([, input]) => !input.value)
			|| inputs.find(([, input]) => input.corrected && !input.correct)
			|| []
		if (!inputId) return
		inputRefs.current[inputId].focus()
	}, [exercises])

	const handleEnter = useCallback(() => {
		if (pageStep == "options") return startExercises()
		if (pageStep == "end") return
		if (!exercises) return
		const exercise = exercises.items[exercises.index]
		if (exercise.state == "normal") {
			const firstEmptyInput = Object.entries(exercise.inputs).find(([, input]) => !input.value)
			if (!firstEmptyInput) return correctExercise()
			focusEmptyOrIncorrectInput()
		} else if (exercise.state == "corrected") {
			const allCorrect = Object.values(exercise.inputs).every(inp => inp.corrected && inp.correct)
			if (!allCorrect) return retryExercise()
			if (exercises.index == exercises.items.length - 1) return end()
			return nextExercise()
		}
	}, [
		correctExercise, focusEmptyOrIncorrectInput, nextExercise, retryExercise, startExercises,
		pageStep, exercises
	])

	useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (e.key !== "Enter") return
			if ((e.target as HTMLElement).tagName.toLowerCase() === "button") return
			handleEnter()
		}
		window.addEventListener("keydown", handleKey)
		return () => window.removeEventListener("keydown", handleKey)
	}, [handleEnter])

	useEffect(() => {
		if (pageStep !== "normal" || !exercises) return
		focusEmptyOrIncorrectInput()
	}, [exercises, focusEmptyOrIncorrectInput, pageStep])

	useEffect(() => { inputRefs.current = {} }, [pageStep, exercises?.index])

	return (
		<div className="w-full h-full flex-col p-4 flex items-center gap-4">
			<Title {...{ pageStep, exercises }} />
			<div className="flex flex-col grow
					space-y-4
				  w-full
				  rounded-3xl
				  py-3 px-5 text-4xl
				  overflow-y-scroll
					pb-8">
				{
					pageStep === "options"
						? <Options {...{ apiOptions, userOptionValues, setUserOptionValues }} />
						: pageStep === "end"
							? <End exercises={exercises!} />
							: <ExerciseContext exercise={exercises?.items?.[exercises.index]} {...{ inputRefs, setExercises }} />
				}
			</div>
			<div className="w-full flex gap-4 items-center justify-center">
				<Buttons {...{
					pageStep, exercises, apiOptions, actions: {
						startExercises, correctExercise, retryExercise, nextExercise, end
					}
				}} />
			</div>
		</div>
	)
}
