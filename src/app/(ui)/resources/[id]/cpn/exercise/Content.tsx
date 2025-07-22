"use client"

import { RefObject } from "react";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { Widget } from "@cpn/Widget";
import { HookSetter } from "@/lib/extra";
import { AnyExerciseContent, ExerciseInputContent, ExerciseParagraphSection, ExerciseTextContent, ExerciseWidgetSection } from "@/lib/resources";
import { FullyGeneratedExerciseState, ExerciseData } from "./extra";


export type ExerciseContentProps = {
	state: FullyGeneratedExerciseState,
	setState: HookSetter<FullyGeneratedExerciseState>,
	inputRefs: RefObject<Record<string, HTMLInputElement>>
}
export function Content({ inputRefs, state, setState }: ExerciseContentProps) {
	if (!state.exercises) return;
	const exercise = state.exercises[state.index]
	return <div>
		{
			exercise.content
				.map((node, i) => <Node key={i} {...{ exercise, node, setState, inputRefs }} />)
		}
	</div>
}

function getInput(exercise: ExerciseData, id: string) {
	return exercise && exercise.inputs[id]
}

export type NodeProps = {
	exercise: ExerciseData
	setState: ExerciseContentProps["setState"],
	node: AnyExerciseContent,
	inputRefs: ExerciseContentProps["inputRefs"],
}

function Node(props: NodeProps) {
	const node = props.node
	switch (props.node.type) {
		case 'p':
			return <ParagraphNode {...props} node={node as ExerciseParagraphSection} />
		case 'text':
			return <TextNode {...props} node={node as ExerciseTextContent} />
		case 'input':
			return <InputNode {...props} node={node as ExerciseInputContent} />
		case "widget":
			return <WidgetNode {...props} node={node as ExerciseWidgetSection} />
	}
}

function InputNode({ exercise, node, inputRefs, setState }: NodeProps & { node: ExerciseInputContent }) {
	const input = getInput(exercise, node.id)
	return (
		<input
			type="number"
			ref={ref => { if (ref && !inputRefs.current[node.id]) inputRefs.current[node.id] = ref }}
			disabled={exercise.state !== 'normal'}
			onChange={e => {
				const { value } = e.target
				setState(prev => {
					const items = [...prev.exercises]
					const idx = prev.index
					const ex = { ...items[idx] }
					const inputs = { ...ex.inputs };
					const old = inputs[node.id];
					inputs[node.id] = { ...old, value };
					ex.inputs = inputs;
					items[idx] = ex;
					return { ...prev, exercises: items };
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
function ParagraphNode(props: NodeProps & { node: ExerciseParagraphSection }) {
	return <p className="*:px-1">
		{
			props.node.content
				.map((node, i) => <Node key={i} {...props} {...{ node }} />)
		}
	</p>
}

function TextNode({ node }: NodeProps & { node: ExerciseTextContent }) {
	return <Latex>{node.text}</Latex>
}

function WidgetNode({ node }: NodeProps & { node: ExerciseWidgetSection }) {
	return <Widget id={node.id} props={node.props} />
}
