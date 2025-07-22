"use client";

import { useRef, useState } from "react"
import useSound from "use-sound"
import { End } from "./End";
import { Options } from "./Options";
import { Title } from "./Title";
import { Buttons } from "./Buttons";
import { AnyExerciseBuilder } from "@/lib/resources";
import { Content } from "./Content";
import { HookSetter } from "@/lib/extra";
import {
	ExerciseCtx,
	FullyGeneratedExerciseState,
	useEmptyInputRefsEffect,
	useEnterKeyEffect,
	useExerciseController,
	useFocusInputsEffect,
} from "./extra";

export default function ExercisePage({ exercise }: {
	exercise: ReturnType<AnyExerciseBuilder["serialize"]>
}) {
	const ctx = useExerciseController(exercise) as ExerciseCtx

	useEnterKeyEffect()
	useEmptyInputRefsEffect(ctx)
	useFocusInputsEffect(ctx)


	return (
		<div className="w-full h-full flex-col p-4 flex items-center gap-4">
			<Title {...ctx} />
			<div className="flex flex-col grow
					space-y-4
				  w-full
				  rounded-3xl
				  py-3 px-5 text-4xl
				  overflow-y-scroll
					pb-8">
				{
					ctx.state.step === "options"
						? <Options {...ctx} />
						: ctx.state.step === "end"
							? <End {...ctx} />
							: <Content {...ctx}
								setState={ctx.setState as HookSetter<FullyGeneratedExerciseState>}
							/>
				}
			</div>
			<div className="w-full flex gap-4 items-center justify-center">
				<Buttons {...ctx} />
			</div>
		</div>
	)
}
