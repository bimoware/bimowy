"use client"
import { useEffect, useRef, useState } from "react"
import { ExerciseCtx, ExerciseUserOptionValues, ExerciseState, InputRefs, GeneratedExerciseCtx } from "./types"
import { focusEmptyOrIncorrectInput, handleEnter } from "./client"
import { AnyExerciseBuilder } from "@/lib/resources"
import useSound from "use-sound"
import { LanguageCode } from "@/lib/locale"

export function useEnterKeyEffect(ctx: ExerciseCtx) {
	return useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (e.key !== "Enter") return
			if ((e.target as HTMLElement).tagName.toLowerCase() === "button") return
			handleEnter(ctx)
		}
		window.addEventListener("keydown", handleKey)
		return () => window.removeEventListener("keydown", handleKey)
	}, [])
}

export function useEmptyInputRefsEffect({ inputRefs, state }: ExerciseCtx) {
	return useEffect(() => {
		inputRefs.current = {}
	}, [state?.step, 'index' in state && state.index])
}

export function useFocusInputsEffect(ctx: ExerciseCtx) {
	return useEffect(() => {
		if (ctx.state.step !== "normal") return
		focusEmptyOrIncorrectInput(ctx as GeneratedExerciseCtx)
	}, [])
}

export function useExerciseController(exercise: ReturnType<AnyExerciseBuilder["serialize"]>, locale:LanguageCode) {
	const [state, setState] = useState<ExerciseState>({
		exercise_id: exercise.id,
		step: "options",
		apiOptions: exercise.options,
		userOptionValues: Object.entries(exercise.options).reduce(
			(prev, [key, val]) => ({ ...prev, [key]: val.defaultValue }),
			{} as ExerciseUserOptionValues
		),
	});

	const vfxPlayers = {
		correct: useSound('/audios/correct.mp3', { volume: 0.2 })[0],
		incorrect: useSound('/audios/incorrect.mp3', { volume: 0.4 })[0],
	};

	const inputRefs: InputRefs = useRef({})
	return { state, setState, vfxPlayers, inputRefs, locale }

}