'use client'

import { ContextElement, ContextSection, GeneratedExercise } from '@app/api/defs'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Bloc } from '@cpn/Bloc'
import useSound from 'use-sound'
import { JSX } from 'react/jsx-dev-runtime'
import katex from 'katex'
import { useLocale, useTranslations } from 'next-intl'
import 'katex/dist/katex.min.css'

type PageState = 'not-yet' | 'answering' | 'correcting' | 'corrected' | 'finished'
type ExerciseData = { name: string, desc: string, id: string }
// Correction is now simply a boolean for each input.
type Correction = boolean

export default function ExercisePage() {
  const locale = useLocale()
  const params = useParams()
  const t = useTranslations("ExercisePage")
  const exerciseId = params['exercise_id'] as string

  const [exercises, setExercises] = useState<GeneratedExercise[]>([])
  const [pageState, setPageState] = useState<PageState>('not-yet')
  const [exerciseData, setExerciseData] = useState<ExerciseData>()
  const [exerciseIndex, setExerciseIndex] = useState<number>(0)
  const [allCorrections, setAllCorrections] = useState<Correction[][]>([])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.5 })
  const [playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.5 })

  useEffect(() => {
    fetch('/api/generate/', {
      method: 'POST',
      body: JSON.stringify({ exercise_id: exerciseId, lang: locale })
    })
      .then((res) => res.json())
      .then((res) => {
        const { name, desc, id, exercises: generatedExercises } = res
        setExerciseData({ name, desc, id })
        setExercises(generatedExercises)
        // Initialize allCorrections with empty arrays for each exercise
        setAllCorrections(new Array(generatedExercises.length).fill([]))
      })
  }, [exerciseId, locale])

  useEffect(() => {
    if (pageState !== 'corrected') return
    const currentCorrections = getCurrentCorrections()
    const allCorrect = currentCorrections.every((c) => c === true)
    if (allCorrect) playCorrect()
    else playIncorrect()
  }, [pageState, exerciseIndex, allCorrections])

  // Focus the first incorrect input
  useEffect(() => {
    if (pageState === 'answering') {
      const timer = setTimeout(focusFirstIncorrectInput, 10)
      return () => clearTimeout(timer)
    }
  }, [pageState, exerciseIndex, allCorrections])

  // Keyboard handler
  useEffect(() => {
    function handleEnter(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      if (pageState === 'not-yet') return startExercises()
      if (pageState === 'answering') return startCorrection()
      if (pageState === 'corrected') {
        const currentCorrections = getCurrentCorrections()
        const allCorrect = currentCorrections.every((c) => c === true)
        if (!allCorrect) return tryAgain()
        if (exerciseIndex < exercises.length - 1) return nextExercise()
        return endQuiz()
      }
    }
    window.addEventListener('keydown', handleEnter)
    return () => window.removeEventListener('keydown', handleEnter)
  }, [pageState, allCorrections, exerciseIndex, exercises.length])

  function getCurrentCorrections(): Correction[] {
    return allCorrections[exerciseIndex] || []
  }

  // Instead of collecting inputs with IDs, just count the input elements.
  function countInputs(context: ContextSection[]): number {
    let count = 0
    const traverse = (nodes: (ContextElement | ContextSection)[]) => {
      nodes.forEach((node) => {
        if (node.type === 'input') {
          count++
        } else if (node.type === 'p') {
          traverse(node.content)
        }
      })
    }
    context.forEach((node) => {
      if (node.type === 'p') traverse(node.content)
    })
    return count
  }

  function resetInputRefs() {
    inputRefs.current = []
  }
  function focusFirstIncorrectInput() {
    const currentCorrections = getCurrentCorrections()
    if (currentCorrections.length === 0) {
      const input = inputRefs.current[0]
      if (input) { input.focus(); input.select() }
      return
    }
    const firstIncorrectIndex = currentCorrections.findIndex((c) => c !== true)
    if (firstIncorrectIndex === -1) return
    const input = inputRefs.current[firstIncorrectIndex]
    if (!input) return
    input.focus()
    input.select()
  }

  function startExercises() {
    setPageState('answering')
    setExerciseIndex(0)
    // Reset all corrections for a new quiz
    setAllCorrections(new Array(exercises.length).fill([]))
    resetInputRefs()
  }

  function nextExercise() {
    setPageState('answering')
    setExerciseIndex((prev) => prev + 1)
    resetInputRefs()
  }

  // Now the corrections are a plain boolean array.
  function handleCorrection(corrections: Correction[]) {
    const currentCorrections = getCurrentCorrections()
    const newCorrections = corrections.map((correct, i) =>
      currentCorrections[i] === undefined ? correct : (currentCorrections[i] || correct)
    )
    setAllCorrections((prev) => {
      const updated = [...prev]
      updated[exerciseIndex] = newCorrections
      return updated
    })
    setPageState('corrected')
  }

  function startCorrection() {
    const exercise = exercises[exerciseIndex]
    if (!exercise) return

    // Get count of inputs from the exercise context.
    const inputsCount = countInputs(exercise.context)
    const answers = inputRefs.current.slice(0, inputsCount).map((el) => el?.value || '')
    if (answers.some((a) => !a.trim())) return

    setPageState('correcting')

    fetch('/api/validate/', {
      method: 'POST',
      body: JSON.stringify({
        exercise_id: exerciseId,
        answers, // now an array of strings by position
        seed: exercise.seed
      })
    })
      .then((res) => res.json())
      .then(handleCorrection)
  }

  function tryAgain() {
    setPageState('answering')
  }

  // In this new structure, if an input is correct, disable it.
  function getIsInputDisabled(index: number) {
    const currentCorrections = getCurrentCorrections()
    return pageState !== 'answering' || currentCorrections[index] === true
  }

  function endQuiz() {
    setPageState('finished')
  }

  // Display emoji based on correction boolean:
  function getExerciseCorrectionEmoji(exerciseIndex: number) {
    const corrections = allCorrections[exerciseIndex]
    if (!corrections || corrections.length === 0) return "⚪"
    return corrections.every((c) => c === true) ? "🟢" : "🔴"
  }

  if (pageState === 'finished')
    return (
      <Bloc type='full-body'>
        <div className='flex gap-4 justify-center items-center'>
          <span className='font-bold text-5xl'>{t('Finished')}!</span>
        </div>
        <CorrectionDisplay allCorrections={allCorrections} />
      </Bloc>
    )

  return (
    <div className='grow flex m-4 gap-4'>
      <div className='grow flex flex-col items-center'>
        <Title
          {...{ allCorrections, exerciseData, exercises, pageState, getExerciseCorrectionEmoji }}
        />
        <ExerciseContent
          {...{ exercises, exerciseIndex, pageState, inputRefs, allCorrections, getIsInputDisabled }}
        />
        <div className='items-end mt-auto pt-4 flex grow'>
          <ActionButtons
            {...{ pageState, allCorrections, exerciseIndex, exercises, actions: { startCorrection, startExercises, nextExercise, endQuiz, tryAgain } }}
          />
        </div>
      </div>
    </div>
  )
}

function CorrectionDisplay({ allCorrections }: { allCorrections: Correction[][] }) {
  const t = useTranslations("ExercisePage")
  const total = allCorrections.reduce((acc, corrections) => {
    return acc + corrections.reduce((acc, c) => (c === true ? acc + 1 : acc), 0)
  }, 0)
  const totalCount = allCorrections.reduce((acc, corrections) => acc + corrections.length, 0)
  const accuracy = totalCount === 0 ? 0 : total / totalCount
  const accuracyPercentage = Math.round(accuracy * 100)
  const accuracyText = `${accuracyPercentage}% (${total}/${totalCount})`
  return (
    <div className='flex flex-col items-center gap-10'>
      <span className='text-center text-4xl'>{t('Accuracy')}: {accuracyText}</span>
      <ol className='list-decimal flex flex-col gap-4 text-2xl mx-5'>
        {allCorrections.map((corrections, i) => (
          <div key={i} className='flex gap-2'>
            <li>
              {corrections.map((c, j) => (
                <span key={j}>
                  {c === true ? "🟢" : "🔴"}
                </span>
              ))}
            </li>
          </div>
        ))}
      </ol>
    </div>
  )
}

function ExerciseContent({
  exercises,
  exerciseIndex,
  pageState,
  inputRefs,
  allCorrections,
  getIsInputDisabled
}: {
  exercises: GeneratedExercise[]
  exerciseIndex: number
  pageState: PageState
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>
  allCorrections: Array<Correction[]>
  getIsInputDisabled: (index: number) => boolean
}) {
  const t = useTranslations("ExercisePage")
  if (!exercises.length) return null
  const exercise = exercises[exerciseIndex]
  if (pageState === 'not-yet') return null

  let inputIndex = 0
  const renderNode = (node: (ContextSection | ContextElement), key: number): JSX.Element => {
    switch (node.type) {
      case 'p':
        return (
          <p key={key} className='inline-block space-x-2 items-center'>
            {node.content.map((child, i) => renderNode(child, i))}
          </p>
        )
      case 'text':
        const attributes = { className: `${node.extra?.includes('mono') && 'font-mono'}
        ${node.extra?.includes('latex') && 'text-3xl'}` }
        return node.extra?.includes('latex') ? (
          <span key={key} {...attributes}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(node.text, {
                throwOnError: false,
                output: 'mathml',
              }),
            }}
          />
        ) : (
          <span key={key} {...attributes}>
            {node.text}
          </span>
        );
      case 'input': {
        const currentIndex = inputIndex++
        const currentCorrections = allCorrections[exerciseIndex] || []
        return (
          <input
            key={`${exerciseIndex}-${currentIndex}`}
            ref={(el) => { inputRefs.current[currentIndex] = el }}
            disabled={getIsInputDisabled(currentIndex)}
            className={`text-center rounded-md px-2 py-1 bg-neutral-800 w-fit max-w-24
              ${currentCorrections[currentIndex] === undefined
                ? 'focus:outline-2 focus:outline-white outline-1 outline-neutral-50/20'
                : currentCorrections[currentIndex]
                  ? 'outline-3 outline-green-500'
                  : 'outline-3 outline-red-500'
              }`}
          />
        )
      }
      default:
        return <span key={key} />
    }
  }

  return (
    <div className='overflow-y-scroll bg-neutral-900 rounded-3xl
     flex flex-col w-full
     p-4 text-4xl px-7
     space-y-4'>
      {exercise.context.map((node, i) => renderNode(node, i))}
    </div>
  )
}

function ActionButtons({
  pageState,
  allCorrections,
  exerciseIndex,
  exercises,
  actions
}: {
  pageState: PageState
  allCorrections: Array<Correction[]>
  exerciseIndex: number
  exercises: GeneratedExercise[]
  actions: {
    startExercises: () => void
    startCorrection: () => void
    nextExercise: () => void
    endQuiz: () => void
    tryAgain: () => void
  }
}) {
  const t = useTranslations('Buttons')
  if (pageState === 'not-yet') {
    return (
      <div className='flex justify-center'>
        <Button name={t('Start')} icon='/svgs/start.svg' onClick={actions.startExercises} enter />
      </div>
    )
  }
  const currentCorrections = allCorrections[exerciseIndex] || []
  const allCorrect = currentCorrections.every((c) => c === true)
  const buttons = []
  if (pageState === "answering") {
    buttons.push(
      <Button key="confirm" name={t('Confirm')} icon='/svgs/check.svg' onClick={actions.startCorrection} />
    )
  } else if (pageState === "correcting") {
    buttons.push(
      <Button key="correcting" name="Correcting..." icon='/svgs/loading.svg' disabled />
    )
  } else if (pageState === "corrected") {
    const isLastExercise = exerciseIndex === exercises.length - 1
    if (!allCorrect) {
      buttons.push(
        <Button key="redo" name='Try Again' icon='/svgs/undo.svg' onClick={actions.tryAgain} enter />
      )
    }
    if (isLastExercise) {
      buttons.push(
        <Button key="finish" name={t('Finish')} icon='/svgs/end.svg' onClick={actions.endQuiz} enter />
      )
    } else {
      if (allCorrect) {
        buttons.push(
          <Button key="next" name={t('Next')} icon='/svgs/next.svg' onClick={actions.nextExercise} enter />
        )
      } else {
        buttons.push(
          <Button key="abandon" name={t('Abandon')} icon='/svgs/next.svg' onClick={actions.nextExercise} />
        )
      }
    }
  }
  return (
    <div className='flex justify-center items-center gap-4 h-full '>
      {buttons}
    </div>
  )
}

function Button({ name, icon, onClick, enter, disabled }: {
  name: string;
  icon: string;
  onClick?: () => void;
  enter?: boolean;
  disabled?: boolean
}) {
  return (
    <div className={`${disabled
      ? "**:cursor-not-allowed opacity-50 bg-neutral-500/50"
      : "**:cursor-pointer hover:scale-105 hover:shadow-md bg-indigo-800"}
    relative flex w-fit h-fit
    group
     cursor-pointer
    shadow-black/50 transition-all
    px-3 py-2
    rounded-2xl text-3xl`} {...{ onClick }}>
      <button {...{ disabled }} className="flex items-center gap-1">
        <Image src={icon} alt={name} width={30} height={30} className="p-1 h-full aspect-square" />
        <span>{name}</span>
      </button>
      {enter && (
        <div className="absolute -top-3 -right-3
        group-hover:rotate-3 -translate-y-1 translate-x-1
        duration-150">
          <Image src={"/svgs/enter.svg"} width={32} height={32} alt="Enter" />
        </div>
      )}
    </div>
  );
}

function Title({
  exerciseData,
  getExerciseCorrectionEmoji,
  exercises,
  allCorrections,
  pageState
}: {
  exerciseData: ExerciseData | undefined
  getExerciseCorrectionEmoji: (exerciseIndex: number) => string
  exercises: GeneratedExercise[]
  allCorrections: Correction[][]
  pageState: PageState
}) {
  const t = useTranslations("ExercisePage")
  return (
    <h1 className='mt-2 ml-4'>
      {!exerciseData
        ? "..."
        : (exerciseData.name +
          " - " +
          (pageState === 'not-yet'
            ? exercises.length + " " + t('Questions')
            : allCorrections.map((_, i) => getExerciseCorrectionEmoji(i)).join('')))}
    </h1>
  )
}