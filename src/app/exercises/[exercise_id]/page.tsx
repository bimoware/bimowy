'use client';

import { GeneratedExercise, APIOption, ContextElement, ContextSection } from "@app/api/defs"
import Image from "next/image";
import { useParams } from "next/navigation"
import { Dispatch, JSX, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "use-intl"
import useSound from "use-sound"
import katex from "katex"
import "katex/dist/katex.min.css"
import { ExerciseRouteResult } from "@app/api/exercise/route";
import { GenerateRouteResult } from "@app/api/generate/route";
import { ValidateRouteResult } from "@app/api/validate/route";
import Togglable from "@cpn/Togglable";

export type UserOption = { id: string, value: any }
type PageStep = 'options' | 'normal' | 'end'
type ExerciseState = 'normal' | 'correcting' | 'corrected'
type ExerciseData = {
	content: GeneratedExercise,
	state: ExerciseState,
	inputs: Record<string, Input>
}
type Input = {
	value: string
} & ({
	corrected: false
} | {
	corrected: true,
	correct: boolean,
	correctOnFirstTry: boolean,
	tries: number
})
type Exercise = {
	items: ExerciseData[];
	index: number;
}

export default function ExercisePage() {
	// [exercise_id]
	const { exercise_id: exerciseId } = useParams<{ exercise_id: string }>()

	// Language
	const locale = useLocale()

	const [pageStep, setPageStep] = useState<PageStep>('options')
	// Exercises
	const [exercises, setExercises] = useState<Exercise>()

	// Topic data
	const [name, setName] = useState<string>()

	// Options
	const [apiOptions, setAPIOptions] = useState<APIOption[]>(),
		[userOptionValues, setUserOptionValues] = useState<Record<string, any>>()

	// Sounds
	const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.2 }),
		[playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.4 })

	// Input refs
	const inputRefs = useRef<Record<string, HTMLInputElement>>({})

	// Functions
	const actions = {
		startExercises: async function () {
			if (pageStep == "normal") return console.error('Exercises already started!')
			setPageStep('normal')
			return await actions.fetchExercises()
		},
		fetchOptions: async function () {
			const url = new URL('/api/exercise', window.location.origin);
			url.searchParams.append('id', exerciseId);
			url.searchParams.append('lang', locale);

			return await fetch(url)
				.then(res => res.json())
				.then(res => res.data)
				.then((data: ExerciseRouteResult) => {
					setName(data.name);
					setAPIOptions(data.options);

					const userOptionValues = data.options
						.reduce((o, key) => Object.assign(o, { [key.id]: key.defaultValue }), {})
					setUserOptionValues(userOptionValues)
				})
		},
		getAllInputIDs(section: ContextSection | ContextElement) {
			const inputs: string[] = []
			switch (section.type) {
				case 'input':
					inputs.push(section.id)
					break
				case 'p':
					section.content.forEach(content => {
						inputs.push(...actions.getAllInputIDs(content))
					});
					break
			}
			return inputs
		},
		fetchExercises: async function () {
			const url = new URL('/api/generate', window.location.origin);
			url.searchParams.append('id', exerciseId);
			url.searchParams.append('lang', locale);
			return await fetch(url, {
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userOptionValues)
			})
				.then(res => res.json())
				.then(res => res.data)
				.then((data: GenerateRouteResult) => {
					setExercises({
						items: data.map((ex) => {
							const inputs: Record<string, { value: string; corrected: false }> = {};
							for (const section of ex.context) {
								actions.getAllInputIDs(section).forEach(id => {
									inputs[id] = { value: '', corrected: false };
								});
							}
							return {
								content: ex,
								state: 'normal',
								inputs
							};
						}),
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
				return { items: newItems, index: prev.index };
			})
		},
		correctExercise: async function () {
			if (!exercises) throw new Error('No exercises to start correcting')
			const exercise = exercises.items[exercises.index]
			actions.setCurrentExerciseState('correcting')

			const answers = Object.fromEntries(
				Object.entries(exercise.inputs).map(([id, input]) => [id, input.value])
			)
			const url = new URL('/api/validate', window.location.origin)
			url.searchParams.append('id', exerciseId)

			return await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answers, seed: exercise.content.seed })
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

						return { items: newItems, index: prev.index };
					});
				})
		},
		retryExercise: function () {
			actions.setCurrentExerciseState('normal')
		},
		nextExercise: function () {
			setExercises(prev => {
				if (!prev) throw new Error('No exercises to retry')
				const next = prev.index + 1
				return { ...prev, index: next }
			})
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
						<span key={key}
							className={`${node.extra?.includes('mono') && "font-mono"}`}>{node.text}</span>
					)

				case 'input':
					const input = actions.getInput(node.id)
					return (
						<input
							ref={(ref) => {
								if (ref && !inputRefs.current[node.id]) {
									inputRefs.current[node.id] = ref
								}
							}}
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

									const old = inputs[node.id]

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
								input && input.corrected && (input.correct
									? "!outline-green-500/50 !bg-green-500/10"
									: "!outline-red-500/50") || ""
							}
						/>
					)
				default:
					return <>wtf</>
			}
		},
		focusEmptyOrIncorrectInput() {
			if (!exercises) return;
			const exercise = exercises.items[exercises.index]
			if (exercise.state != "normal") return;
			const inputs = Object.entries(exercise.inputs)
			const [inputId /*, inputData */] = inputs.find(([id, input]) => !input.value)
				|| inputs.find(([id, input]) => input.corrected && !input.correct)
				|| []
			if (!inputId) return;
			inputRefs.current[inputId].focus()
		},
		// handleEnter
		// If selecting a button, will trigger it
		// If not, will
		// - If exercise state is normal
		// - - If not all inputs are filled, will select the first empty one
		// - - If all inputs are filled, will correct it
		// - If exercise state is correcting, will do nothing
		// - If exercise state is corrected
		// - - If exercise is fully correct, will go to the next exercise
		// - - If exercise is not fully correct, will retry it
		handleEnter: function () {
			if (pageStep == "options") return actions.startExercises()
			if (pageStep == "end") return;
			// PageStep == "normal":
			if (!exercises) return;
			const exercise = exercises.items[exercises.index]
			if (exercise.state == "normal") {
				const inputs = Object.entries(exercise.inputs)
				const firstEmptyInput = inputs.find(([id, input]) => !input.value)
				if (!firstEmptyInput) return actions.correctExercise()
				actions.focusEmptyOrIncorrectInput()
			} else if (exercise.state == "corrected") {
				const allCorrect = Object.values(exercise.inputs).every(input => input.corrected && input.correct)
				if (!allCorrect) return actions.retryExercise()
				if (exercises.index == exercises.items.length - 1) return actions.end()
				return actions.nextExercise()
			}
		}
	}

	// Fetch options on page load
	useEffect(() => { actions.fetchOptions() }, [])

	// Handle Enter
	useEffect(() => {
		function handleEnter(e: KeyboardEvent) {
			if (e.key !== "Enter") return;
			actions.handleEnter()
		}
		window.addEventListener("keydown", handleEnter)
		return () => window.removeEventListener("keydown", handleEnter)
	}, [actions])


	// Focus first empty element
	useEffect(() => {
		if (pageStep != "normal" || !exercises) return;
		actions.focusEmptyOrIncorrectInput()
	}, [exercises?.items[exercises.index].state])

	// Clear input refs when changing exercise
	useEffect(() => {
		inputRefs.current = {}
	}, [pageStep, exercises?.index])


	const blocClass = "flex flex-col space-y-2 bg-neutral-900 w-full rounded-3xl py-3 px-5"
	return <div className="w-full h-full flex-col p-4
	flex items-center gap-4">
		<Title {...{ pageStep, name, exercises }} />
		<div className={`${blocClass} grow text-4xl overflow-y-scroll`}>
			{pageStep == "options"
				? <Options {...{ apiOptions, userOptionValues, setUserOptionValues }} />
				: pageStep == "end"
					? <End {...{ exercises }} />
					: <ExerciseContext {...{ inputRefs, exercises, renderNode: actions.renderNode }} />}
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
	return <h1>{name ?? "..."}  {
		pageStep != "options" && exercises && (
			<>
				<span> - </span>
				<ExerciseCorrections {...{ exercises }} />
			</>)
	}</h1>
}

function ExerciseCorrections({ exercises, }: { exercises: Exercise }) {

	return exercises.items.map(e => {
		const inputs = Object.values(e.inputs)
		const isCorrected = inputs.every(inp => inp.corrected)
		if (!isCorrected || !inputs.length) return "⬜"
		const isCorrect = inputs.every(inp => inp.correct)
		if (!isCorrect) return "🟥"
		const isCorrectOnFirstTry = inputs.every(inp => inp.correctOnFirstTry)
		if (!isCorrectOnFirstTry) return "🟨"
		else return "🟩"
	})
}


function Options({ apiOptions, userOptionValues, setUserOptionValues }: {
	apiOptions?: APIOption[],
	userOptionValues?: Record<string, any>,
	setUserOptionValues: Dispatch<SetStateAction<Record<string, any>>>
}) {
	if (!apiOptions || !userOptionValues) return;
	return apiOptions.map(option => {
		const { type, id, title } = option
		switch (type) {
			case 'number':
				const numberMin = option.min
				const numberMax = option.max
				const numberValue = userOptionValues[id] as number
				return <div key={id}>
					<span>{title}: </span>
					<input
						{...{ type }}
						min={numberMin}
						max={numberMax}
						value={numberValue}
						onChange={(e) => {
							const value = e.target.value;
							setUserOptionValues(prev => {
								const newUserOptions = { ...prev }
								newUserOptions[id] = value
								return newUserOptions;
							})
						}} />
				</div>
			case 'boolean':
				const booleanValue = userOptionValues[id] as boolean
				return <div key={id}>
					<span>{title}? </span>
					<Togglable
						checked={booleanValue}
						onChange={() => {
							setUserOptionValues(prev => {
								const newUserOptions = { ...prev }
								newUserOptions[id] = !prev[id]
								return newUserOptions;
							})
						}}
					/>
				</div>
			case 'range':
				const rangeValue = userOptionValues[id] as [number, number]
				return <div key={id}>
					<span>{title}: </span>
					<input
						type="number"
						value={rangeValue[0]}
						onChange={(e) => {
							let value = Number(e.target.value);
							if (value < rangeValue[1]) setUserOptionValues(prev => {
								const newUserOptions = { ...prev }
								newUserOptions[id] = [value, prev[id][1]]
								return newUserOptions;
							})
						}} />
					<span> - </span>
					<input
						type="number"
						value={rangeValue[1]}
						onChange={(e) => {
							const value = Number(e.target.value);
							if (value > rangeValue[0]) setUserOptionValues(prev => {
								const newUserOptions = { ...prev }
								newUserOptions[id] = [prev[id][0], value]
								return newUserOptions;
							})
						}} />
				</div>
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
					if (Object.values(exercise.inputs).every(inp => inp.value)) return <Button alt={t('Confirm')} src='/svgs/check.svg' onClick={actions.correctExercise} enter />
					else return <Button alt={t('Confirm')} src='/svgs/check.svg' disabled />
				case 'correcting':
					return <Button alt={t('Correcting')} disabled />
				case 'corrected':
					const allCorrect = Object.values(exercise.inputs).every(input => input.corrected && input.correct)
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