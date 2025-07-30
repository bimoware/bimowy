"use client"

import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

import { Widget } from "@cpn/Widget";
import { AnyExerciseContent, ExerciseInputContent, ExerciseParagraphSection, ExerciseTextContent, ExerciseWidgetSection } from "@/lib/resources";
import { ExerciseData, GeneratedExerciseCtx } from "./extra";
import NumberInput from '@cpn/ui/NumberInput';

export function Content(props: GeneratedExerciseCtx) {
	const exercise = props.state.exercises[props.state.index]
	return <div>
		{
			exercise.content
				.map((node, i) => <Node key={i} {...props} {...{ node }} />)
		}
	</div>
}

function getInput(exercise: ExerciseData, id: string) {
	return exercise && exercise.inputs[id]
}

export type NodeProps = GeneratedExerciseCtx & {
	node: AnyExerciseContent
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

function InputNode({ state, node, inputRefs, setState }: NodeProps & { node: ExerciseInputContent }) {
	const exercise = state.exercises[state.index]
	const input = getInput(exercise, node.id)

	return (
		<NumberInput
			setValue={(v) => {
				setState(prev => {
					const items = [...prev.exercises]
					const idx = prev.index
					const ex = { ...items[idx] }
					const inputs = { ...ex.inputs };
					const old = inputs[node.id];
					inputs[node.id] = { ...old, value:v};
					ex.inputs = inputs;
					items[idx] = ex;
					return { ...prev, exercises: items };
				})
			}}
			ref={ref => { if (ref && !inputRefs.current[node.id]) inputRefs.current[node.id] = ref }}
			disabled={exercise.state !== 'normal'}
			value={input?.value}
		/>
	)
}
function ParagraphNode(props: NodeProps & { node: ExerciseParagraphSection }) {
	return <div className="*:px-1 flex">
		{
			props.node.content
				.map((node, i) => <Node key={i} {...props} {...{ node }} />)
		}
	</div>
}

function TextNode({ node }: NodeProps & { node: ExerciseTextContent }) {
	return <Latex>{node.text}</Latex>
}

function WidgetNode({ node }: NodeProps & { node: ExerciseWidgetSection }) {
	return <div className="w-2xl">
		<Widget id={node.id} props={node.props} />
		</div>
}
