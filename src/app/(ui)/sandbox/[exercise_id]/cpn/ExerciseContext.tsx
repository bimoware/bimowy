import { ContextElement, ContextSection } from "@api/ressources/exercises/defs";
import { Exercise, ExerciseData } from "./ClientPage";
import { ReactNode } from "react";

export function ExerciseContext({ exercises, renderNode }: {
	exercises?: Exercise,
	renderNode: (exercise: ExerciseData, node: ContextElement | ContextSection, key: number) => ReactNode
}) {
	if (!exercises) return;
	const exercise = exercises.items[exercises.index]
	if (!exercise) return;
	return <div>{exercise.content.context.map((node, i) => renderNode(exercise, node, i))}</div>
}