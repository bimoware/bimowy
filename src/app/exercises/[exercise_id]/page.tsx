'use client';

import { GeneratedExercise, APIOption, ContextElement, ContextSection } from "@app/api/defs"
import Image from "next/image";
import { useParams } from "next/navigation"
import { Dispatch, JSX, RefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "use-intl"
import useSound from "use-sound"
import katex from "katex"
import "katex/dist/katex.min.css"
import { ExerciseRouteResult } from "@app/api/exercise/route";
import { GenerateRouteResult } from "@app/api/generate/route";
import { ValidateRouteResult } from "@app/api/validate/route";
import { M_PLUS_1 } from "next/font/google";

export type UserOption = { id: string, value: any }
type PageStep = 'options' | 'normal' | 'end'
type ExerciseState = 'normal' | 'correcting' | 'corrected'
type ExerciseData = {
	content: GeneratedExercise,
	state: ExerciseState,
	inputs: Record<string, {
		value: string
	} & ({
		corrected: false
	} | {
		corrected: true,
		correct: boolean,
		correctOnFirstTry: boolean,
		tries: number
	})>
}
type Exercise = {
	items: ExerciseData[];
	index: number;
}

export default function ExercisePage() {
	// [exercise_id]
	const { exercise_id: exerciseId } = useParams<{ exercise_id: string }>()

	// Language
	// const t = useTranslations('ExercisePage')
	const locale = useLocale()

	const [pageStep, setPageStep] = useState<PageStep>('options')
	// Exercises
	const [exercises, setExercises] = useState<Exercise>()

	// Topic data
	const [name, setName] = useState<string>()

	// Options
	const [apiOptions, setAPIOptions] = useState<APIOption[]>(),
		[userOptions, setUserOptions] = useState<UserOption[]>([])

	// Sounds
	const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.2 }),
		[playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.4 })

	// Inputs
	// const inputRefs =	 useRef<Record<string, HTMLInputElement | null>>({});

	// Functions
	const actions = {
		startExercises: async function () {
			setPageStep('normal')
			return actions.fetchExercises()
		},
		fetchOptions: function () {
			const url = new URL('/api/exercise', window.location.origin);
			url.searchParams.append('id', exerciseId);
			url.searchParams.append('lang', locale);

			fetch(url)
				.then(res => res.json())
				.then(res => res.data)
				.then((data: ExerciseRouteResult) => {
					setName(data.name);
					setAPIOptions(data.options);
				})
		},
		fetchExercises: async function () {
			const url = new URL('/api/generate', window.location.origin);
			url.searchParams.append('id', exerciseId);
			url.searchParams.append('lang', locale);
			url.searchParams.append('options', encodeURI(JSON.stringify(userOptions)))

			return await fetch(url)
				.then(res => res.json())
				.then(res => res.data)
				.then((data: GenerateRouteResult) => {
					setExercises({
						items: data.map((ex) => ({
							content: ex,
							state: 'normal',
							inputs: {}
						})),
						index: 0
					})
				})
		},
		setCurrentExerciseState: function (state: ExerciseState) {
			if (!exercises) throw new Error('No exercises to set state')
			setExercises(prev => {
				if (!prev) throw new Error('No exercises to set state')
				const newItems = [...prev.items]
				const current = { ...newItems[prev.index] };
				current.state = state
				newItems[prev.index] = current
				return { ...prev, items: newItems, index: prev.index };
			})
		},
		correctExercise: async function () {
			if (!exercises) throw new Error('No exercises to start correcting')
			const exercise = exercises.items[exercises.index]
			actions.setCurrentExerciseState('correcting')
			// Put into a variable answers, an object with as properties "ID"s and as values "value"
			const answers = Object.fromEntries(
				Object.entries(exercise.inputs).map(([id, input]) => [id, input.value])
			)
			const url = new URL('/api/validate', window.location.origin)
			url.searchParams.append('id', exerciseId)
			url.searchParams.append('seed', exercise.content.seed.join(','))

			return await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(answers)
			})
				.then(res => res.json())
				.then(res => res.data)
				.then((corrections: ValidateRouteResult) => {
					const isAllCorrect = Object.values(corrections).every(Boolean)
					if (isAllCorrect) playCorrect()
					else playIncorrect()

					actions.setCurrentExerciseState('corrected')

					setExercises(prev => {
						if (!prev) throw new Error('No exercises to apply correction')
						const newItems = [...prev.items];
						const current = { ...newItems[prev.index] };

						for (const id of Object.keys(current.inputs)) {
							const isCorrect = corrections[id];
							const input = current.inputs[id];
							current.inputs[id] = {
								value: input.value,
								corrected: true,
								correct: isCorrect,
								correctOnFirstTry:
									input.corrected && typeof input.correctOnFirstTry === 'boolean'
										? input.correctOnFirstTry
										: isCorrect,
								tries: input.corrected ? (input.tries || 0) + 1 : 1,
							};
						}

						newItems[prev.index] = current;

						return { ...prev, items: newItems, index: prev.index };
					});
				})
		},
		retryExercise: function () {
			actions.setCurrentExerciseState('normal')
		},
		nextExercise: function () {
			if (!exercises) throw new Error('No exercises to retry')
			exercises.index += 1
			actions.setCurrentExerciseState('normal')
		},
		end: function () {
			setPageStep('end')
		},
		getInput: function (id: string) {
			return exercises && exercises?.items[exercises.index].inputs[id]
		},
		renderNode: function (exercise: ExerciseData, node: ContextElement | ContextSection, key: number) {
			switch (node.type) {
				case 'p':
					return <p key={key} className="*:px-1">
						{node.content.map((subNode, i) => actions.renderNode(exercise, subNode, key + i))}
					</p>

				case 'text':
					const html = node.extra?.includes('latex')
						? katex.renderToString(node.text, { throwOnError: false, output: 'mathml' })
						: undefined
					return html ? (
						<span key={key} dangerouslySetInnerHTML={{ __html: html }} />
					) : (
						<span key={key}>{node.text}</span>
					)

				case 'input':
					return (
						<input
							key={node.id}
							disabled={exercise.state !== 'normal'}
							onChange={e => {
								const { value } = e.target
								setExercises(prev => {
									if (!prev) throw new Error('No exercises to change input')

									const items = [...prev.items]
									const idx = prev.index

									const ex = { ...items[idx] }
									const inputs = { ...ex.inputs }

									const old = inputs[node.id] ?? { value: '', corrected: false }

									inputs[node.id] = {
										...old,
										value
									}

									ex.inputs = inputs
									items[idx] = ex

									return { ...prev, items }
								})
							}}
							value={actions.getInput(node.id)?.value || ''}
							className={
								(() => {
									const input = actions.getInput(node.id)
									return input && input.corrected ? (
										input.correct!
											? "!outline-green-500/50 !bg-green-500/10"
											: "!outline-red-500/50"
									) : ""
								})()
							}
						/>
					)
				default:
					return <>wtf</>
			}
		}
	}

	useEffect(() => actions.fetchOptions(), [])


	const blocClass = "flex bg-neutral-900 w-full rounded-3xl py-3 px-5"
	return <div className="w-full h-full flex-col p-4
	flex items-center gap-4">
		<Title {...{ pageStep, name, exercises }} />
		<div className={`${blocClass} grow text-4xl`}>
			{pageStep == "options"
				? <Options {...{ apiOptions, userOptions, setUserOptions }} />
				: pageStep == "end"
					? <End {...{ exercises }} />
					: <ExerciseContext {...{ exercises, renderNode: actions.renderNode }} />}
		</div>
		<div className="w-full flex gap-4 items-center justify-center">
			<Buttons {...{ pageStep, exercises, apiOptions, actions }} />
		</div>
	</div>

}

function End({ exercises }: { exercises?: Exercise }) {
	if (!exercises) return;
	const t = useTranslations('ExercisePage')
	let allTotals = 0
	return <div className="w-full flex flex-col gap-10">
		<h1 className="text-center w-full">{t('Finished')}</h1>
		<div className="bg-neutral-950/50 w-fit p-3 rounded-xl outline outline-white/10 flex flex-col gap-4 font-mono">
			{
				exercises.items.map((exercise, i) => {
					// Calculate score
					// All correct on first try = 100%
					// All correct but not on first try = 50%
					// Else = 0%
					// We should write ⬜ for not corrected, 🟩 for correct on first try, 🟨 for correct but not on first try, 🟥 for incorrect
					// For all individual exercise inputs
					let total = 0
					let subtotal = 0
					const emojis = Object.values(exercise.inputs).map(input => {
						total += 1
						if (!input.corrected) return "⬜"
						if (input.correctOnFirstTry) {
							subtotal += 1
							return "🟩"
						}
						if (input.correct) {
							subtotal += 0.5;
							return `🟨 (${input.tries} ${t('tries')})`;
						}
						return "🟥"
					}).join('');
					const percentage = Math.round(subtotal / total * 100)
					allTotals += percentage
					return <p key={i}>{i + 1}. {emojis} {percentage}% ({subtotal}/{total})</p>;
				})
			}
		</div>
		<p>{t('Score')}: {Math.round(allTotals / exercises.items.length)}%</p>
	</div>
}
function Title({ name, pageStep, exercises }: {
	name?: string
	pageStep: PageStep
	exercises?: Exercise
}) {
	const t = useTranslations('ExercisePage')
	return <h1>{name ?? "???"} - {
		pageStep == "options"
			? t('SelectingOptions')
			: exercises && exercises.items.map(e => {
				const inputs = Object.values(e.inputs)
				const isCorrected = inputs.every(inp => inp.corrected)
				if (!isCorrected || !inputs.length) return "⬜"
				const isCorrect = inputs.every(inp => inp.correct)
				if (!isCorrect) return "🟥"
				const isCorrectOnFirstTry = inputs.every(inp => inp.correctOnFirstTry)
				if (!isCorrectOnFirstTry) return "🟨"
				else return "🟩"
			}).join('')
	}</h1>
}
function Options({ apiOptions, userOptions, setUserOptions }: {
	apiOptions?: APIOption[],
	userOptions: UserOption[],
	setUserOptions: Dispatch<SetStateAction<UserOption[]>>
}) {
	if (!apiOptions) return;
	return apiOptions.map(option => {
		const { type, id, title, defaultValue } = option
		switch (type) {
			case 'number':
				const { min, max } = option
				return <p key={id}>
					<span>{title}: </span>
					<input
						{...{ type, min, max }}
						value={userOptions.find(o => o.id == id)?.value ?? defaultValue}
						onChange={(e) => {
							const value = e.target.value;
							setUserOptions(prev => {
								const newUserOptions = [...prev]
								if (newUserOptions.some(o => o.id == id)) {
									newUserOptions.find(o => o.id == id)!.value = value
								} else {
									newUserOptions.push({ id, value })
								}
								return newUserOptions;
							})
						}} />
				</p>
		}
	})
}
function ExerciseContext({ exercises, renderNode }: {
	exercises?: Exercise,
	renderNode: (exercise: ExerciseData, node: ContextElement | ContextSection, key: number) => JSX.Element
}) {
	if (!exercises) return;
	const exercise = exercises.items[exercises.index]
	if (!exercise) return;
	return <div>{exercise.content.context.map((node, i) => renderNode(exercise, node, i))}</div>
}

function Buttons({ pageStep, exercises, apiOptions, actions }: {
	pageStep: PageStep,
	exercises?: Exercise,
	apiOptions?: APIOption[],
	actions: {
		startExercises: () => Promise<void>
		correctExercise: () => Promise<void>
		retryExercise: () => void
		nextExercise: () => void,
		end: () => void
	}
}) {
	const t = useTranslations('Buttons')
	switch (pageStep) {
		case 'options':
			if (apiOptions?.length) return <Button alt={t('Start')} src='/svgs/start.svg' onClick={actions.startExercises} enter />
			else return <Button alt={t('LoadingOptions')} disabled />
		case 'normal':
			if (!exercises) return <Button alt={t('LoadingExercises')} disabled />
			const exercise = exercises.items[exercises.index]
			switch (exercise.state) {
				case 'normal':
					return <Button alt={t('Confirm')} src='/svgs/check.svg' onClick={actions.correctExercise} enter />
				case 'correcting':
					return <Button alt={t('Correcting')} disabled />
				case 'corrected':
					const allCorrect = Object.entries(exercise.inputs).every(([id, input]) => input.corrected && input.correct)
					const isLast = exercises.index < exercises.items.length - 1
					return <>
						{!allCorrect && (
							<Button alt={t('TryAgain')} src='/svgs/undo.svg' onClick={actions.retryExercise} enter />
						)}

						<Button
							alt={
								isLast
									? t(allCorrect ? 'Next' : 'Abandon')
									: t('Finish')
							}
							src={isLast ? '/svgs/next.svg' : '/svgs/end.svg'}
							onClick={isLast ? actions.nextExercise : actions.end}
						/>
					</>

			}
	}
}
function Button({ alt, src, onClick, disabled, enter }: {
	alt: string;
	onClick?: () => void;
	src?: string,
	disabled?: boolean,
	enter?: boolean
}) {
	return (
		<button
			{...{ onClick, disabled }}
			className={`
				disabled:hover:scale-[98%] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-800/50
				hover:scale-105 bg-indigo-800 cursor-pointer
				duration-150
				flex items-center gap-2 px-3 py-2 rounded-2xl text-3xl
				relative group`}
		>
			<Image {...{ alt, src: src || "/svgs/loading.svg" }} width={30} height={30} />
			<span>{alt}</span>
			{enter && <Image alt="enter" width={30} height={30} src="/svgs/enter.svg"
				className="absolute
			right-0 top-0 -mt-2 -mr-2
			shadow-lg group-hover:rotate-5 duration-150"/>}
		</button>
	)
}