import { ExerciseContent } from "@/lib/resources";
import { ExerciseCtx, ExerciseData, ExerciseState, GeneratedExerciseCtx, Input, UngeneratedExerciseCtx } from "./types";
import { redirect } from "next/navigation";
import { ExercisesGenerateRouteResult } from "@api/resources/[id]/generate/route";
import { ExercisesValidateRouteResult } from "@api/resources/[id]/validate/route";
import { HookSetter } from "@/lib/extra";

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

export async function fetchExercises({ state, setState, locale }: ExerciseCtx) {
	if (state.step != "options") throw new Error()
	const url = new URL(`/api/resources/${state.exercise_id}/generate`, window.location.origin)
	url.searchParams.append('lang', locale)
	const result = await fetch(url, {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(state.userOptionValues)
	}).then(res => res.json())
	if (!result.ok) {
		return alert(result.message)
	}
	const { data }: { data: ExercisesGenerateRouteResult } = result
	const exercises = data.map((ex) => {
		const inputs: Record<string, Input> = {}
		for (const id of getAllInputIDs(ex.content)) {
			inputs[id] = {
				value: 0,
				corrected: false
			}
		}
		return { content: ex.content, seed:ex.seed,state: 'normal' as const, inputs }
	});

	(setState as HookSetter<ExerciseState>)(prev => ({
		...prev,
		step: "normal",
		exercises,
		index: 0,
		pageStep: "normal"
	}))
}

export async function startExercises(ctx: UngeneratedExerciseCtx) {
	return await fetchExercises(ctx)
}

export async function correctExercise(ctx: GeneratedExerciseCtx) {
	const { state } = ctx
	const exercise = state.exercises[state.index]
	setCurrentExerciseState(ctx, 'correcting')

	const answers = Object.fromEntries(
		Object.entries(exercise.inputs).map(([id, input]) => [id, input.value])
	)
	const url = new URL(`/api/resources/${state.exercise_id}/validate`, window.location.origin)
	const corrections: ExercisesValidateRouteResult = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			answers, seed: state.exercises[state.index].seed
		})
	})
		.then(res => res.json())
		.then(res => res.data)
	const isAllCorrect = Object.values(corrections).every(Boolean)
	if (isAllCorrect) ctx.vfxPlayers.correct()
	else ctx.vfxPlayers.incorrect()

	setCurrentExerciseState(ctx, 'corrected')

	ctx.setState(prev => {
		const newItems = [...prev.exercises]
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
}


export function retryExercise(ctx: GeneratedExerciseCtx) {
	setCurrentExerciseState(ctx, "normal")
}

export function setCurrentExerciseState({ setState }: GeneratedExerciseCtx, step: ExerciseData["state"]) {
	setState(prev => {
		const newExercises = [...prev.exercises]
		const currentExercise = newExercises[prev.index]
		currentExercise.state = step
		return { ...prev, exercises: newExercises }
	})
}

export function nextExercise(ctx: GeneratedExerciseCtx) {
	ctx.setState(prev => {
		const next = prev.index + 1
		return { ...prev, index: next }
	})
	setCurrentExerciseState(ctx, 'normal')
}

export function end({ setState }: GeneratedExerciseCtx) {
	setState(prev => ({ ...prev, step: 'end' }))
}

export function focusEmptyOrIncorrectInput({ state, inputRefs }: GeneratedExerciseCtx) {
	if (state.step === "end") return;
	const exercise = state.exercises[state.index]
	const inputs = Object.entries(exercise.inputs)
	const [inputId] = inputs.find(([, input]) => !input.value)
		|| inputs.find(([, input]) => input.corrected && !input.correct)
		|| []
	if (!inputId) return
	inputRefs.current[inputId].focus()
}

export function handleEnter(ctx: ExerciseCtx) {
	if (ctx.state.step == "end") return redirect("/resources/")
	if (ctx.state.step === "options") return
	const exercise = ctx.state.exercises[ctx.state.index]
	const newCtx = ctx as GeneratedExerciseCtx
	if (exercise.state == "normal") {
		const firstEmptyInput = Object.entries(exercise.inputs).find(([, input]) => !input.value)
		if (!firstEmptyInput) return correctExercise(newCtx)
		focusEmptyOrIncorrectInput(newCtx)
	} else if (exercise.state == "corrected") {
		const allCorrect = Object.values(exercise.inputs).every(inp => inp.corrected && inp.correct)
		if (!allCorrect) return retryExercise(newCtx)
		if (ctx.state.index == ctx.state.exercises.length - 1) return end(newCtx)
		return nextExercise(newCtx)
	}
}