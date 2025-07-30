import { AnyExerciseBuilder, AnyExerciseContent, ExerciseSeed } from "@/lib/resources"
import { RefObject } from "react"
import { useExerciseController } from "./use"
import { HookSetter } from "@/lib/extra"

export type PageStep = 'options' | 'normal' | 'end'
export type SerializedExercise = ReturnType<AnyExerciseBuilder["serialize"]>
export type ExerciseData = {
	seed:ExerciseSeed
	content: AnyExerciseContent[],
	state: 'normal' | 'correcting' | 'corrected',
	inputs: Record<string, Input>,
}
export type Input = {
	value: number
} & ({
	corrected: false
} | {
	corrected: true,
	correct: boolean,
	correctOnFirstTry: boolean,
	tries: number,
})
export type ExerciseAPIOptions = SerializedExercise["options"]
export type ExerciseUserOptionValues = {
	[K in keyof ExerciseAPIOptions]: ExerciseAPIOptions[K]["defaultValue"]
}
export type UngeneratedExerciseState = {
	exercise_id: string
	step: "options",
	apiOptions: ExerciseAPIOptions,
	userOptionValues: ExerciseUserOptionValues
}
export type GeneratedExerciseState = {
	exercise_id: string
	step: 'normal' | 'end'
	exercises: ExerciseData[];
	index: number;
}
export type VFXPlayers = {
	correct: () => void;
	incorrect: () => void;
}
export type InputRefs = RefObject<Record<string, HTMLInputElement>>

export type ExerciseState = UngeneratedExerciseState | GeneratedExerciseState

type BaseExerciseCtx = Omit<ReturnType<typeof useExerciseController>,"state"|"setState">

export type UngeneratedExerciseCtx = BaseExerciseCtx & {
	state: UngeneratedExerciseState
	setState: HookSetter<UngeneratedExerciseState>
} 

export type GeneratedExerciseCtx = BaseExerciseCtx & {
	state: GeneratedExerciseState
	setState: HookSetter<GeneratedExerciseState>
}

export type ExerciseCtx = GeneratedExerciseCtx | UngeneratedExerciseCtx
