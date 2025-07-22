import { AnyExerciseBuilder, AnyExerciseContent } from "@/lib/resources"
import { RefObject } from "react"
import { useExerciseController } from "./use"
import { HookSetter } from "@/lib/extra"

export type PageStep = 'options' | 'normal' | 'end'
export type SerializedExercise = ReturnType<AnyExerciseBuilder["serialize"]>
export type ExerciseData = {
	content: AnyExerciseContent[],
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
export type ExerciseAPIOptions = SerializedExercise["options"]
export type ExerciseUserOptionValues = {
	[K in keyof ExerciseAPIOptions]: ExerciseAPIOptions[K]["defaultValue"]
}
export type PartialGeneratedExerciseState = {
	exercise_id: string
	step: "options",
	apiOptions: ExerciseAPIOptions,
	userOptionValues: ExerciseUserOptionValues
}
export type FullyGeneratedExerciseState = {
	exercise_id: string
	step: 'normal' | 'end'
	exercises: ExerciseData[];
	index: number;
}
export type VFXPlayers = {
	correct: () => void;
	incorrect: () => void;
}
export type GeneratedExerciseState = PartialGeneratedExerciseState | FullyGeneratedExerciseState
export type InputRefs = RefObject<Record<string, HTMLInputElement>>

export type ExerciseCtx = ReturnType<typeof useExerciseController> & ({
	state: PartialGeneratedExerciseState
	setState: HookSetter<PartialGeneratedExerciseState>
} | {
	state: FullyGeneratedExerciseState
	setState: HookSetter<FullyGeneratedExerciseState>
})