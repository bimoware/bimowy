"use client"
import { ContextElement, ContextInput, ContextParagraph, ContextSection, ContextString, ContextWidget } from "@/lib/resources";
import { Exercise, ExerciseData } from "./ExercisePage";
import { Dispatch, RefObject, SetStateAction } from "react";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import ALL_WIDGETS from "@cpn/widgets";
import { Widget } from "@cpn/Widget";


export type ExerciseContextProps = {
	exercise?: ExerciseData,
	setExercises: Dispatch<SetStateAction<Exercise | undefined>>,
	inputRefs: RefObject<Record<string, HTMLInputElement>>
}
export function ExerciseContext({ inputRefs, exercise, setExercises }: ExerciseContextProps) {
	if (!exercise) return;
	return <div>
		{
			exercise.content.context
				.map((node, i) => <Node key={i} {...{ exercise, node, setExercises, inputRefs }} />)
		}
	</div>
}

function getInput(exercise: ExerciseData, id: string) {
	return exercise && exercise.inputs[id]
}

export type NodeProps = {
	exercise: NonNullable<ExerciseContextProps["exercise"]>,
	node: ContextSection | ContextElement,
	inputRefs: ExerciseContextProps["inputRefs"],
	setExercises: ExerciseContextProps["setExercises"]
}

function Node({ exercise, node, inputRefs, setExercises }: NodeProps) {
	switch (node.type) {
		case 'p':
			return <ParagraphNode {...{ node, exercise, inputRefs, setExercises }} />
		case 'text':
			return <TextNode {...{ node, exercise }} />
		case 'input':
			return <InputNode {...{ node, exercise, inputRefs, setExercises }} />
		case "widget":
			return <WidgetNode {...{ node }} />
	}
}

function InputNode({ exercise, node, inputRefs, setExercises }: NodeProps & { node: ContextInput }) {
	const input = getInput(exercise, node.id)
	return (
		<input
			type="number"
			ref={ref => { if (ref && !inputRefs.current[node.id]) inputRefs.current[node.id] = ref }}
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
			value={getInput(exercise, node.id)?.value || ''}
			className={
				input && input.corrected && (input.correct
					? "!outline-green-500/50 !bg-green-500/10"
					: "!outline-red-500/50") || ""
			}
		/>
	)
}
function ParagraphNode({ node, exercise, inputRefs, setExercises }: {
	node: ContextParagraph,
	exercise: NodeProps["exercise"],
	inputRefs: ExerciseContextProps["inputRefs"],
	setExercises: ExerciseContextProps["setExercises"]
}) {
	return <p className="*:px-1">
		{
			node.content
				.map((node, i) => <Node
					key={i}
					{...{ node, exercise, inputRefs, setExercises }} />)
		}
	</p>
}

function TextNode({ node }: {
	node: ContextString
}) {
	return <span
		className={`${node.extra?.includes('mono') && "font-mono"}`}>
		{
			node.extra?.includes('latex')
				? <Latex>{node.text}</Latex>
				: node.text
		}
	</span>
}

function WidgetNode({ node }: { node: ContextWidget<keyof typeof ALL_WIDGETS> }) {
	return <Widget id={node.id} props={node.props} />
}
