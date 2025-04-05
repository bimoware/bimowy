'use client';

import { GeneratedExercise } from '@app/api/defs';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Bloc } from '@cpn/Bloc';
import useSound from 'use-sound';
import { JSX } from 'react/jsx-dev-runtime';
import katex from 'katex';
import 'katex/dist/katex.min.css';

type PageState =
	| 'not-yet'
	| 'answering'
	| 'correcting'
	| 'corrected'
	| 'finished';
type ExerciseData = { name: string; desc: string; id: string };
type ExerciseCorrection = { id: string; is_correct: boolean };

export default function ExercisePage() {
	const params = useParams();
	const exerciseId = params['exercise_id']!;

	const [exercises, setExercises] = useState<GeneratedExercise[]>([]);
	const [pageState, setPageState] = useState<PageState>('not-yet');
	const [exerciseData, setExerciseData] = useState<ExerciseData>();
	const [exerciseIndex, setExerciseIndex] = useState<number>(0);
	const [corrections, setCorrections] = useState<
		Array<{ correctOnFirstTry: boolean; correct: boolean } | null>
	>([]);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.5 });
	const [playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.5 });

	// Generate questions
	useEffect(() => {
		fetch('/api/generate/', {
			method: 'POST',
			body: JSON.stringify({ exercise_id: exerciseId }),
		})
			.then((res) => res.json())
			.then((res) => {
				const { name, desc, id, exercises: generatedExercises } = res;
				setExerciseData({ name, desc, id });
				setExercises(generatedExercises);
			});
	}, [exerciseId]);

	useEffect(() => {
		if (pageState != 'corrected') return;
		const allCorrect = corrections.every((c) => c?.correct);
		if (allCorrect) playCorrect();
		else playIncorrect();
	}, [pageState]);

	// Focus the first incorrect input
	useEffect(() => {
		if (pageState === 'answering') {
			const timer = setTimeout(focusFirstIncorrectInput, 10);
			return () => clearTimeout(timer);
		}
	}, [pageState, exerciseIndex]);

	// Keyboard handler
	useEffect(() => {
		function handleEnter(e: KeyboardEvent) {
			if (e.key !== 'Enter') return;
			if (pageState === 'not-yet') return startExercises();
			if (pageState === 'answering') return startCorrection();
			if (pageState === 'corrected') {
				const allCorrect = corrections.every((c) => c?.correct);
				if (!allCorrect) return tryAgain();
				if (exerciseIndex < exercises.length - 1) return nextExercise();
				return endQuiz();
			}
		}

		window.addEventListener('keydown', handleEnter);
		return () => window.removeEventListener('keydown', handleEnter);
	}, [pageState, corrections, exerciseIndex, exercises.length]);

	function collectInputs(context: GeneratedExercise['context']) {
		const inputs: { id: string }[] = [];
		const traverse = (nodes: GeneratedExercise['context']) => {
			nodes.forEach((node) => {
				if (node.type === 'input') {
					inputs.push({ id: node.id });
				} else if (node.type === 'p') {
					traverse(node.content);
				}
			});
		};
		traverse(context);
		return inputs;
	}

	function focusFirstIncorrectInput() {
		// If there are no corrections yet, focus the first input.
		if (corrections.length === 0) {
			const input = inputRefs.current[0];
			if (input) {
				input.focus();
				input.select();
			}
			return;
		}

		const firstIncorrectIndex = corrections.findIndex((c) => !c || !c.correct);
		if (firstIncorrectIndex === -1) return;
		const input = inputRefs.current[firstIncorrectIndex];
		if (!input) return;
		input.focus();
		input.select();
	}


	function startExercises() {
		setPageState('answering');
		setExerciseIndex(0);
		setCorrections([]);
		inputRefs.current = [];
	}

	function nextExercise() {
		setPageState('answering');
		setExerciseIndex((prev) => prev + 1);
		setCorrections([]);
		inputRefs.current = [];
	}

	function handleCorrection(res: ExerciseCorrection[]) {
		setCorrections((prev) =>
			res.map((answer, i) => ({
				correct: answer.is_correct,
				correctOnFirstTry: prev[i]?.correctOnFirstTry ?? answer.is_correct,
			}))
		);
		setPageState('corrected');
	}

	function startCorrection() {
		const exercise = exercises[exerciseIndex];
		if (!exercise) return;

		const inputs = collectInputs(exercise.context);
		const answers = inputs.map((input, index) => ({
			id: input.id,
			value: inputRefs.current[index]?.value || '',
		}));
		if (answers.some(a => a.value.trim() === "")) return;

		setPageState('correcting');

		fetch('/api/validate/', {
			method: 'POST',
			body: JSON.stringify({
				exercise_id: exerciseId,
				answers,
				seed: exercise.seed,
			}),
		})
			.then((res) => res.json())
			.then(handleCorrection);
	}

	function tryAgain() {
		setCorrections([]);
		setPageState('answering');
	}

	function getIsInputDisabled(index: number) {
		const correction = corrections[index];
		if (pageState !== 'answering') return true;
		if (!correction) return false;
		return correction.correctOnFirstTry || correction.correct;
	}

	function endQuiz() {
		setPageState('finished');
	}

	if (pageState === 'finished')
		return (
			<Bloc type='full-body'>
				<div className='flex gap-4 justify-center items-center'>
					<span className='font-bold text-5xl'>Finished!</span>
					<Image
						src={'/media/cat.gif'}
						width={200}
						height={200}
						className='h-8 w-fit aspect-square'
						alt={'Cat vibing'}
					/>
				</div>
			</Bloc>
		);

	return (
		<div className='grow flex m-4 gap-4'>
			<div className='grow flex flex-col items-center'>
				<Title {...{ exerciseData, exercises, exerciseIndex, pageState }} />
				<div className='grow w-full bg-neutral-900 rounded-3xl p-4 flex flex-col'>
					<ExerciseContent
						{...{ exerciseData, exercises, exerciseIndex, pageState, inputRefs, corrections }}
						getIsInputDisabled={getIsInputDisabled}
					/>

					<div className='mt-auto pt-4'>
						<ActionButtons
							{...{ pageState, corrections, exerciseIndex, exercises }}
							actions={{
								startExercises,
								startCorrection,
								nextExercise,
								endQuiz,
								tryAgain,
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}


function ExerciseContent({
	exercises,
	exerciseIndex,
	pageState,
	inputRefs,
	corrections,
	getIsInputDisabled,
}: {
	exercises: GeneratedExercise[];
	exerciseIndex: number;
	pageState: PageState;
	inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
	corrections: Array<{ correctOnFirstTry: boolean; correct: boolean } | null>;
	getIsInputDisabled: (index: number) => boolean;
}) {
	if (!exercises.length) return <div>Loading exercises...</div>;
	const exercise = exercises[exerciseIndex];
	if (!exercise) return <div>Exercise not found</div>;
	if (pageState === "not-yet") return <></>;

	let inputIndex = 0;

	const renderNode = (
		node: GeneratedExercise['context'][0],
		key: number
	): JSX.Element => {
		switch (node.type) {
			case 'p':
				return (
					<p key={key} className="inline-block space-x-2 items-center">
						{node.content.map((child, i) => renderNode(child, i))}
					</p>
				);
			case 'text':
				return <span key={key}>{node.text}</span>;
			case 'latex':
				const html = katex.renderToString(node.text, {
					throwOnError: false,
					output: 'mathml'
				});
				return <span key={key} className="text-2xl" dangerouslySetInnerHTML={{ __html: html }} />;
			case 'input':
				const currentIndex = inputIndex++;
				const correction = corrections[currentIndex];
				return (
					<input
						key={`${exerciseIndex}-${currentIndex}`}
						ref={el => { inputRefs.current[currentIndex] = el }}
						disabled={getIsInputDisabled(currentIndex)}
						className={`text-center rounded-md px-2 py-1 bg-neutral-800 w-fit max-w-24
							${!correction ? "focus:outline-2 outline-1 outline-white" : correction.correct
								? 'outline-3 outline-green-500'
								: 'outline-3 outline-red-500'
							}`}
					/>
				);
			default:
				return <span key={key} />;
		}
	};

	return (
		<div className="p-4 text-4xl space-y-4">
			{exercise.context.map((node, i) => renderNode(node, i))}
		</div>
	);
}

function ActionButtons({
	pageState,
	corrections,
	exerciseIndex,
	exercises,
	actions,
}: {
	pageState: PageState;
	corrections: Array<{ correctOnFirstTry: boolean; correct: boolean } | null>;
	exerciseIndex: number;
	exercises: GeneratedExercise[];
	actions: {
		startExercises: () => void;
		startCorrection: () => void;
		nextExercise: () => void;
		endQuiz: () => void;
		tryAgain: () => void;
	};
}) {
	if (pageState === 'not-yet') {
		return (
			<div className="flex justify-center">
				<Button
					name="Start"
					icon="/svgs/start.svg"
					onClick={actions.startExercises}
				/>
			</div>
		);
	}

	return (
		<div className="flex justify-center gap-4">
			{pageState === 'answering' && (
				<Button
					name="Confirm"
					icon="/svgs/check.svg"
					onClick={actions.startCorrection}
				/>
			)}

			{pageState === 'corrected' && (
				<>
					{corrections.some(c => !c?.correct) && (
						<Button
							name="Try Again"
							icon="/svgs/undo.svg"
							onClick={actions.tryAgain}
						/>
					)}
					{exerciseIndex === exercises.length - 1 ? (
						<Button
							name="Finish"
							icon="/svgs/end.svg"
							onClick={actions.endQuiz}
						/>
					) : (
						<Button
							name="Next"
							icon="/svgs/next.svg"
							onClick={actions.nextExercise}
						/>
					)}
				</>
			)}
		</div>
	);
}

function Button({
	name,
	icon,
	onClick,
}: {
	name: string;
	icon: string;
	onClick: () => void;
}) {
	return (
		<button className='flex gap-1' onClick={onClick}>
			<Image
				src={icon}
				alt={name}
				width={50}
				height={50}
				className='w-fit aspect-square'
			/>
			<span>{name}</span>
		</button>
	);
}
function Title({
	exerciseData,
	exercises,
	exerciseIndex,
	pageState,
}: {
	exerciseData: ExerciseData | undefined;
	exercises: GeneratedExercise[];
	exerciseIndex: number;
	pageState: PageState;
}) {
	return exerciseData ? (
		<h1 className='mt-2 ml-4' title={exerciseData.desc}>
			{exerciseData.name}
			{pageState === 'not-yet'
				? ` - ${exercises.length} Questions`
				: ` - Question ${exerciseIndex + 1}/${exercises.length}`}
		</h1>
	) : (
		<></>
	);
}