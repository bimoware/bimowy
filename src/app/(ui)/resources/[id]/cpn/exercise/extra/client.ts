import { getLanguage } from "@/lib/locale";
import { ExerciseContent } from "@/lib/resources";
import { ExercisesGenerateRouteResult } from "@api/resources/[id]/generate/route";
import { ExerciseCtx, ExerciseData, Input } from "./types";
import { redirect } from "next/navigation";
import { ExercisesValidateRouteResult } from "@api/resources/[id]/validate/route";

export function getAllInputIDs(content: ExerciseContent) {
	const inputs: string[] = []
	for (const section of content) {
		if (section.type != "p") continue;
		for (const elem of section.content) {
			if (elem.type != "input") continue;
			inputs.push(elem.id)
		}
	}
	return inputs
}

export async function fetchExercises({ state, setState }: ExerciseCtx) {
	if (state.step != "options") throw new Error()
	const locale = await getLanguage()
	const url = new URL(`/api/resources/${state.exercise_id}/generate`, window.location.origin)
	url.searchParams.append('lang', locale)
	const res = await fetch(url, {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(state.userOptionValues)
	})
	const result = await res.json()
	if (!result.ok) {
		return alert(result.message)
	}
	const { data }: { data: ExercisesGenerateRouteResult } = result
	const exercises = data.map((ex) => {
		const inputs: Record<string, Input> = {}
		for (const id of getAllInputIDs(ex.content)) {
			inputs[id] = {
				value: '',
				corrected: false
			}
		}
		return { content: ex.content, state: 'normal' as const, inputs }
	})
	setState({
		...state,
		step: "normal",
		exercises,
		index: 0
	})
}

export async function startExercises(params: ExerciseCtx) {
	return await fetchExercises(params)
}

export async function correctExercise(ctx: ExerciseCtx) {
	const { state } = ctx
	if (state.step === "options") throw new Error()
	const exercise = state.exercises[state.index]
	setCurrentExerciseState(ctx, 'correcting')

	const answers = Object.fromEntries(
		Object.entries(exercise.inputs).map(([id, input]) => [id, input.value])
	)
	const url = new URL(`/api/resources/${state.exercise_id}/validate`, window.location.origin)

	return await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			answers, seed: state.exercises[state.index] // FIXME
		})
	})
		.then(res => res.json())
		.then(res => res.data)
		.then((corrections: ExercisesValidateRouteResult) => {
			const isAllCorrect = Object.values(corrections).every(Boolean)
			if (isAllCorrect) ctx.vfxPlayers.correct()
			else ctx.vfxPlayers.incorrect()

			setCurrentExerciseState(ctx, 'corrected')

			setExercises(prev => {
				if (prev.pageStep === "options") throw new Error()
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
				return { ...prev, items: newItems }
			})
		})
}


export function retryExercise(ctx: ExerciseCtx, step: ExerciseData["state"]) {
	setCurrentExerciseState(ctx, step)
}

export function setCurrentExerciseState({ setState }: ExerciseCtx, step: ExerciseData["state"]) {
	setState(prev => {
		if (prev.step === "options") throw new Error()
		const newExercises = [...prev.exercises]
		const currentExercise = newExercises[prev.index]
		currentExercise.state = step
		return { ...prev, exercises: newExercises }
	})
}

export function nextExercise({ state, setState, locale }: ExerciseCtx) {
	setState(prev => {
		if (prev.step == "options") throw new Error()
		const next = prev.index + 1
		return { ...prev, index: next }
	})
	setCurrentExerciseState('normal')
}

export function end({ state, setState, locale }: ExerciseCtx) {
	setExercises(prev => {
		if (prev.pageStep === "options") throw new Error()
		return { ...prev, pageStep: 'end' }
	})
}

export function focusEmptyOrIncorrectInput({ state, setState, locale }: ExerciseCtx) {
	if (state.step === "end") return;
	const exercise = state.exercises[state.index]
	const inputs = Object.entries(exercise.inputs)
	const [inputId] = inputs.find(([, input]) => !input.value)
		|| inputs.find(([, input]) => input.corrected && !input.correct)
		|| []
	if (!inputId) return
	inputRefs.current[inputId].focus()
}

export function handleEnter({ state, setState, locale }: ExerciseCtx) {
	if (state.step == "options") return startExercises()
	if (state.step == "end") return redirect("/resources/")
	if (!state.exercises) return
	const exercise = state.exercises[state.index]
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
}