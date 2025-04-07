'use client'

import { GeneratedExercise } from '@app/api/defs'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Bloc } from '@cpn/Bloc'
import useSound from 'use-sound'
import { JSX } from 'react/jsx-dev-runtime'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useLocale, useTranslations } from 'next-intl'

type PageState = 'not-yet' | 'answering' | 'correcting' | 'corrected' | 'finished'

type ExerciseData = {
  name: string
  desc: string
  id: string
}

type ExerciseCorrection = {
  id: string
  is_correct: boolean
}

type Correction = { correctOnFirstTry: boolean; correct: boolean; id: string }


export default function ExercisePage() {
  const locale = useLocale()
  const params = useParams()
  const t = useTranslations("ExercisePage")
  const exerciseId = params['exercise_id']!

  const [exercises, setExercises] = useState<GeneratedExercise[]>([])
  const [pageState, setPageState] = useState<PageState>('not-yet')
  const [exerciseData, setExerciseData] = useState<ExerciseData>()
  const [exerciseIndex, setExerciseIndex] = useState<number>(0)
  const [allCorrections, setAllCorrections] = useState<Correction[][]>([])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.5 })
  const [playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.5 })

  function getCurrentCorrections(): Correction[] {
    return allCorrections[exerciseIndex] || []
  }

  // Generate questions
  useEffect(() => {
    fetch('/api/generate/', {
      method: 'POST',
      body: JSON.stringify({ exercise_id: exerciseId, lang: locale })
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        const { name, desc, id, exercises: generatedExercises } = res
        setExerciseData({ name, desc, id })
        setExercises(generatedExercises)
        // Initialize allCorrections with empty arrays for each exercise
        setAllCorrections(new Array(generatedExercises.length).fill([]))
      })
  }, [exerciseId])

  useEffect(() => {
    if (pageState !== 'corrected') return
    const currentCorrections = getCurrentCorrections()
    const allCorrect = currentCorrections.every((c) => c?.correct)
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
        const allCorrect = currentCorrections.every((c) => c?.correct)
        if (!allCorrect) return tryAgain()
        if (exerciseIndex < exercises.length - 1) return nextExercise()
        return endQuiz()
      }
    }
    window.addEventListener('keydown', handleEnter)
    return () => window.removeEventListener('keydown', handleEnter)
  }, [pageState, allCorrections, exerciseIndex, exercises.length])

  function collectInputs(context: GeneratedExercise['context']) {
    const inputs: { id: string }[] = []
    const traverse = (nodes: GeneratedExercise['context']) => {
      nodes.forEach((node) => {
        if (node.type === 'input') {
          inputs.push({ id: node.id })
        } else if (node.type === 'p') {
          traverse(node.content)
        }
      })
    }
    traverse(context)
    return inputs
  }

  function focusFirstIncorrectInput() {
    const currentCorrections = getCurrentCorrections()
    // If no corrections yet, focus first input.
    if (currentCorrections.length === 0) {
      const input = inputRefs.current[0]
      if (input) {
        input.focus()
        input.select()
      }
      return
    }

    const firstIncorrectIndex = currentCorrections.findIndex((c) => !c || !c.correct)
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
    inputRefs.current = []
  }

  function nextExercise() {
    setPageState('answering')
    setExerciseIndex((prev) => prev + 1)
    inputRefs.current = []
  }

  function handleCorrection(res: ExerciseCorrection[]) {
    const currentCorrections = getCurrentCorrections()
    const newCorrections = res.map((answer, i) => ({
      id: answer.id,
      correct: answer.is_correct,
      correctOnFirstTry: currentCorrections[i]?.correctOnFirstTry ?? answer.is_correct
    }))
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

    const inputs = collectInputs(exercise.context)
    const answers = inputs.map((input, index) => ({
      id: input.id,
      value: inputRefs.current[index]?.value || ''
    }))
    if (answers.some((a) => !a.value.trim())) return

    setPageState('correcting')

    fetch('/api/validate/', {
      method: 'POST',
      body: JSON.stringify({
        exercise_id: exerciseId,
        answers,
        seed: exercise.seed
      })
    })
      .then((res) => res.json())
      .then(handleCorrection)
  }

  function tryAgain() {
    setPageState('answering')
  }

  function getIsInputDisabled(index: number) {
    const currentCorrections = getCurrentCorrections()
    const correction = currentCorrections[index]
    if (pageState !== 'answering') return true
    if (!correction) return false
    return correction.correctOnFirstTry || correction.correct
  }

  function endQuiz() {
    setPageState('finished')
  }

  function getExerciseCorrectionEmoji(exerciseIndex: number) {
    const correction = allCorrections[exerciseIndex]
    if (!correction.length) return "⚪"
    const allCorrectOnFirstTry = correction.every((c) => c.correctOnFirstTry)
    if (allCorrectOnFirstTry) return "🟢"
    const allCorrect = correction.every((c) => c.correct)
    return allCorrect ? "🟠" : "🔴"
  }

  if (pageState === 'finished')
    return (
      <Bloc type='full-body'>
        <div className='flex gap-4 justify-center items-center'>
          <span className='font-bold text-5xl'>{t('Finished')}!</span>
        </div>
        <Correction {...{ allCorrections }} />
      </Bloc>
    )

  return (
    <div className='grow flex m-4 gap-4'>
      <div className='grow flex flex-col items-center'>
        <Title
          {...{ allCorrections, exerciseData, exercises, pageState, getExerciseCorrectionEmoji }}
        />
        <div className='grow w-full bg-neutral-900 rounded-3xl p-4 flex flex-col'>
          <ExerciseContent
            {...{ exercises, exerciseIndex, pageState, inputRefs, allCorrections, getIsInputDisabled }}
          />

          <div className='mt-auto pt-4'>
            <ActionButtons
              {...{ pageState, allCorrections, exerciseIndex, exercises, actions: { startCorrection, startExercises, nextExercise, endQuiz, tryAgain } }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
function Correction({ allCorrections }: { allCorrections: Correction[][] }) {
  /*
  Correct on first try: 100%
  Correcte (not on first try): 50%
  Incorrect: 0%
  */
  const t = useTranslations("ExercisePage")
  const total = allCorrections.reduce((acc, corrections) => {
    return acc + corrections.reduce((acc, c) => {
      if (c.correctOnFirstTry) return acc + 1
      if (c.correct) return acc + 0.5
      return acc
    }, 0)
  }, 0)
  const totalCount = allCorrections.reduce((acc, corrections) => {
    return acc + corrections.length
  }, 0)
  const accuracy = total / totalCount
  const accuracyPercentage = Math.round(accuracy * 100)
  const accuracyText = `${accuracyPercentage}% (${total}/${totalCount})`
  return <div className='flex flex-col items-center gap-10'>
    <span className='text-center text-4xl'>{t('Accuracy')}: {accuracyText}</span>
    <ol className='list-decimal flex flex-col gap-4 text-2xl mx-5'>
      {
        allCorrections.map((corrections, i) => {
          return <div key={i} className='flex gap-2'>
            <li>
              {
                corrections.map((c, j) => {
                  return <span key={j}>{
                    c.correctOnFirstTry
                      ? "🟢"
                      : c.correct
                        ? "🟠"
                        : "🔴"
                  }</span>
                })
              }
            </li>
          </div>
        })
      }
    </ol>
  </div>
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

  if (!exercises.length) return <div>{t("loading_ex")}...</div>
  const exercise = exercises[exerciseIndex]
  if (pageState === 'not-yet') return <></>

  let inputIndex = 0

  const renderNode = (node: GeneratedExercise['context'][0], key: number): JSX.Element => {
    switch (node.type) {
      case 'p':
        return (
          <p key={key} className='inline-block space-x-2 items-center'>
            {node.content.map((child, i) => renderNode(child, i))}
          </p>
        )
      case 'text':
        return <span key={key}>{node.text}</span>
      case 'mono':
        return (
          <span key={key} className="font-mono">
            {node.text}
          </span>
        )
      case 'latex':
        const html = katex.renderToString(node.text, {
          throwOnError: false,
          output: 'mathml'
        })
        return (
          <span key={key} className='text-2xl' dangerouslySetInnerHTML={{ __html: html }} />
        )
      case 'input': {
        const currentIndex = inputIndex++
        const currentCorrections = allCorrections[exerciseIndex] || []
        const correction = currentCorrections[currentIndex]
        return (
          <input
            key={`${exerciseIndex}-${currentIndex}`}
            ref={(el) => {
              inputRefs.current[currentIndex] = el
            }}
            disabled={getIsInputDisabled(currentIndex)}
            className={`text-center rounded-md px-2 py-1 bg-neutral-800 w-fit max-w-24
              ${!correction
                ? 'focus:outline-2 focus:outline-white outline-1 outline-neutral-50/20'
                : correction.correct
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
    <div className='p-4 text-4xl space-y-4'>
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
        <Button name={t('Start')} icon='/svgs/start.svg' onClick={actions.startExercises} />
      </div>
    )
  }
  const allCorrect = allCorrections[exerciseIndex]?.every((c) => c.correct)

  return (
    <div className='flex justify-center items-center gap-4 h-full '>
      {pageState === 'answering' && (
        <Button name={t('Confirm')} icon='/svgs/check.svg' onClick={actions.startCorrection} />
      )}

      {pageState === 'corrected' && (
        <>
          {!allCorrect && <Button name='Try Again' icon='/svgs/undo.svg' onClick={actions.tryAgain} />}
          {
            exerciseIndex === exercises.length - 1 ? (
              <Button name={t('Finish')} icon='/svgs/end.svg' onClick={actions.endQuiz} />
            ) : (
              allCorrect
                ? <Button name={t('Next')} icon='/svgs/next.svg' onClick={actions.nextExercise} />
                : <Button name={t('Abandon_Next')} icon='/svgs/next.svg' onClick={actions.nextExercise} />
            )
          }
        </>
      )}
    </div>
  )
}

function Button({ name, icon, onClick }: { name: string; icon: string; onClick: () => void }) {
  return (
    <button className='flex gap-1' onClick={onClick}>
      <Image src={icon} alt={name} width={50} height={50} className='w-fit aspect-square' />
      <span>{name}</span>
    </button>
  )
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
  return exerciseData ? (
    <h1 className='mt-2 ml-4' title={exerciseData.desc}>
      {exerciseData.name}
      {pageState === 'not-yet'
        ? ` - ${exercises.length} ${t('Questions')}`
        : ` - ${allCorrections
          .map((_, i) => getExerciseCorrectionEmoji(i))
          .join('')}`}
    </h1>
  ) : (
    <></>
  )
}