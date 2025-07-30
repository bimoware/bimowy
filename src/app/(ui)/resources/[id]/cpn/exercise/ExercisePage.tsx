"use client";

import { End } from "./End";
import { Options } from "./Options";
import { Title } from "./Title";
import { Buttons } from "./Buttons";
import { AnyExerciseBuilder } from "@/lib/resources";
import { Content } from "./Content";
import {
	ExerciseCtx,
	GeneratedExerciseCtx,
	UngeneratedExerciseCtx,
	useEmptyInputRefsEffect,
	useEnterKeyEffect,
	useExerciseController,
	useFocusInputsEffect,
} from "./extra";
import { LanguageCode } from "@/lib/locale";

export default function ExercisePage({ exercise,locale }: {
	locale:LanguageCode
	exercise: ReturnType<AnyExerciseBuilder["serialize"]>
}) {
	const ctx = useExerciseController(exercise,locale) as ExerciseCtx

	useEnterKeyEffect(ctx)
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
				  overflow-y-auto
					pb-8">
				{
					ctx.state.step === "options"
						? <Options {...(ctx as UngeneratedExerciseCtx)} />
						: ctx.state.step === "end"
							? <End {...(ctx as GeneratedExerciseCtx)} />
							: <Content {...(ctx as GeneratedExerciseCtx)}/>
				}
			</div>
			<div className="w-full flex gap-4 items-center justify-center">
				<Buttons {...ctx} />
			</div>
		</div>
	)
}
