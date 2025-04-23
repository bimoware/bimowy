'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import useSound from 'use-sound'
import katex from 'katex'
import { JSX, useEffect, useRef, useState } from 'react'
import { ContextElement, ContextSection, GeneratedExercise, APIOption } from '@app/api/defs'
import { Bloc } from '@cpn/Bloc'
import { useLocale, useTranslations } from 'next-intl'
import 'katex/dist/katex.min.css'

// Types

type PageState = 'loadingOptions' | 'options'
  | 'loadingExercise' | 'exercising'
  | 'correcting' | 'corrected' | 'finished'
type ExerciseData = { name: string; desc: string; id: string }
type Correction = { correct: boolean; correctOnFirstTry: boolean }

// Utility Functions

function countInputs(context: ContextSection[]): number {
  let count = 0
  function traverse(nodes: (ContextElement | ContextSection)[]) {
    nodes.forEach(node => {
      if (node.type === 'input') count++
      else if (node.type === 'p') traverse(node.content)
    })
  }
  context.forEach(node => { if (node.type === 'p') traverse(node.content) })
  return count
}

// Subcomponents

function Title({ title, progress }: { title?: string; progress: string }) {
  return <h1 className='mt-2 ml-4'>{title ?? '...'} - {progress}</h1>
}

function Options({ options, values, onChange, loading }: {
  options?: APIOption[];
  values: UserOption[];
  onChange: (id: string, value: any) => void;
  loading: boolean;
}) {
  if (!options) return <div>Loading options...</div>
  return (
    <div className='space-y-4'>
      {options.map(opt => (
        <div key={opt.id} className='flex items-center gap-3'>
          <label className='text-xl'>{opt.title}:</label>
          {opt.type === 'boolean' ? (
            <input
              type='checkbox'
              checked={values.find(v => v.id === opt.id)?.value ?? false}
              onChange={e => onChange(opt.id, e.target.checked)}
              disabled={loading}
              className='w-5 h-5'
            />
          ) : (
            <input
              type='number'
              value={values.find(v => v.id === opt.id)?.value ?? opt.default}
              onChange={e => onChange(opt.id, Number(e.target.value))}
              disabled={loading}
              min={opt.min}
              max={opt.max}
              className='px-2 py-1 bg-neutral-800 rounded-md w-24'
            />
          )}
        </div>
      ))}
    </div>
  )
}

function ExerciseContent({
  exercise,
  index,
  refs,
  corrections,
  disabled
}: {
  exercise: GeneratedExercise;
  index: number;
  refs: React.RefObject<(HTMLInputElement | null)[]>;
  corrections: Correction[];
  disabled: (i: number) => boolean;
}) {
  let inputCounter = 0
  return <>
    {exercise.context.map((node, key) => {
      if (node.type === 'p') {
        return <p key={key} className='inline-block space-x-2'>
          {node.content.map((n, i) => renderNode(n, i))}
        </p>
      }
      return null
    })}
  </>

  function renderNode(node: ContextElement | ContextSection, key: number): JSX.Element {
    if (node.type === 'text') {
      const html = node.extra?.includes('latex')
        ? katex.renderToString(node.text, { throwOnError: false, output: 'mathml' })
        : undefined
      return html ? (
        <span key={key} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <span key={key}>{node.text}</span>
      )
    }
    if (node.type === 'input') {
      const idx = inputCounter++
      const corr = corrections[idx]
      return (
        <input
          key={`${index}-${idx}`}
          ref={el => { refs.current[idx] = el }}
          disabled={disabled(idx)}
          className={`text-center rounded-md px-2 py-1 bg-neutral-800 w-fit max-w-24 ${!corr
            ? 'focus:outline-2 focus:outline-white'
            : corr.correct
              ? (corr.correctOnFirstTry ? 'outline-green-500' : 'outline-orange-500')
              : 'outline-red-500'
            }`}
        />
      )
    }
    // fallback empty span
    return <span key={key} />
  }
}

function CorrectionDisplay({ corrections }: { corrections: Correction[][] }) {
  const t = useTranslations('ExercisePage')
  const total = corrections.flat().reduce((acc, c) => acc + (c.correct ? (c.correctOnFirstTry ? 1 : 0.5) : 0), 0)
  const count = corrections.flat().length
  const pct = count ? Math.round((total / count) * 100) : 0
  return (
    <div className='flex flex-col items-center gap-10'>
      <span className='text-4xl'>{t('Accuracy')}: {pct}% ({total}/{count})</span>
      <ol className='list-decimal space-y-2 text-2xl'>
        {corrections.map((corrs, i) => (
          <li key={i} className='flex gap-2'>
            {corrs.map((c, j) => (
              <span key={j}>{c.correct ? (c.correctOnFirstTry ? '🟢' : '🟠') : '🔴'}</span>
            ))}
          </li>
        ))}
      </ol>
    </div>
  )
}

function Button({ name, icon, onClick, primary, disabled }: {
  name: string;
  icon: string;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        flex items-center gap-1 bg-indigo-800 px-3 py-2 rounded-2xl text-3xl`}
    >
      <Image src={icon} alt={name} width={30} height={30} />
      <span>{name}</span>
    </button>
  )
}

function ActionButtons({
  state,
  corrections,
  idx,
  total,
  actions
}: {
  state: PageState;
  corrections: Correction[][];
  idx: number;
  total: number;
  actions: {
    start: () => void;
    confirm: () => void;
    retry: () => void;
    next: () => void;
    finish: () => void;
  };
}) {
  const t = useTranslations('Buttons')
  const curr = corrections[idx] || []
  const allCorrect = curr.every(c => c.correct)
  switch (state) {
    case 'loadingOptions':
      return <Button name={t('LoadingOptions')} icon='/svgs/loading.svg' disabled />
    case 'options':
      return <Button name={t('Start')} icon='/svgs/start.svg' onClick={actions.start} />
    case 'loadingExercise':
      return <Button name={t('LoadingExercises')} icon='/svgs/loading.svg' disabled />
    case 'exercising':
      return <Button name={t('Confirm')} icon='/svgs/check.svg' onClick={actions.confirm} />
    case 'correcting':
      return <Button name={t('Correcting')} icon='/svgs/loading.svg' disabled />
    case 'corrected':
      if (!allCorrect) return <Button name={t('TryAgain')} icon='/svgs/undo.svg' onClick={actions.retry} />
      if (idx < total - 1) return <Button name={t('Next')} icon='/svgs/next.svg' onClick={actions.next} />
      return <Button name={t('Finish')} icon='/svgs/end.svg' onClick={actions.finish} />
    default:
      return null
  }
}

// Main Component

export default function ExercisePage() {
  const t = useTranslations('ExercisePage')
  const locale = useLocale()
  const { exercise_id: exerciseId } = useParams() as { exercise_id: string }

  // State
  const [optionsData, setOptionsData] = useState<APIOption[]>()
  const [userOptions, setUserOptions] = useState<UserOption[]>([])
  const [pageState, setPageState] = useState<PageState>('options')
  const [exerciseData, setExerciseData] = useState<ExerciseData>()
  const [exercises, setExercises] = useState<GeneratedExercise[]>([])
  const [index, setIndex] = useState(0)
  const [corrections, setCorrections] = useState<Correction[][]>([])
  const inputRefs = useRef<HTMLInputElement[]>([])

  // Sounds
  const [playCorrect] = useSound('/audios/correct.mp3', { volume: 0.5 })
  const [playIncorrect] = useSound('/audios/incorrect.mp3', { volume: 0.5 })

  // Fetch options
  useEffect(() => {
    if (pageState !== 'options') return
    fetch('/api/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercise_id: exerciseId, lang: locale })
    })
      .then(res => res.json())
      .then((data: ExerciseData & { options: APIOption[] }) => {
        setExerciseData({ name: data.name, desc: data.desc, id: data.id })
        setOptionsData(data.options)
        setUserOptions(data.options.map(opt => ({ id: opt.id, value: opt.default })))
      })
      .catch(console.error)
  }, [pageState, exerciseId, locale])

  // Generate exercises
  const start = () => {
    setPageState('loadingExercise')
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercise_id: exerciseId, lang: locale, options: userOptions })
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setExercises(data.exercises)
        setCorrections(new Array(data.exercises.length).fill([]))
        setIndex(0)
        inputRefs.current = []
        setPageState('exercising')
      })
      .catch(() => setPageState('options'))
  }

  // Validate answers
  const confirm = () => {
    const exercise = exercises[index]
    if (!exercise) return
    const count = countInputs(exercise.context)
    const answers = inputRefs.current.slice(0, count).map(el => el?.value || '')
    if (answers.some(a => !a.trim())) return

    setPageState('correcting')
    fetch('/api/validate', { method: 'POST', body: JSON.stringify({ exercise_id: exerciseId, seed: exercise.seed, answers }) })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((res: boolean[]) => handleValidation(res))
      .catch(() => setPageState('exercising'))
  }

  function handleValidation(results: boolean[]) {
    const prev = corrections[index] || []
    const updated = results.map((ok, i) => prev[i]
      ? { ...prev[i], correct: ok }
      : { correct: ok, correctOnFirstTry: ok }
    )
    const all = [...corrections]
    all[index] = updated
    setCorrections(all)
    setPageState('corrected')
  }

  // Effects: feedback sounds & focus
  useEffect(() => {
    if (pageState !== 'corrected') return
    const curr = corrections[index]
    if (curr.every(c => c.correct)) playCorrect()
    else playIncorrect()
  }, [pageState, index])

  useEffect(() => {
    if (pageState === 'exercising') setTimeout(() => {
      const firstErr = corrections[index].findIndex(c => !c.correct)
      const focusIdx = firstErr >= 0 ? firstErr : 0
      inputRefs.current[focusIdx]?.focus()
      inputRefs.current[focusIdx]?.select()
    }, 10)
  }, [pageState, index])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      if (pageState === 'options') start()
      else if (pageState === 'exercising') confirm()
      else if (pageState === 'corrected') {
        const allOk = corrections[index].every(c => c.correct)
        if (!allOk) return setPageState('exercising')
        if (index < exercises.length - 1) setIndex(idx => idx + 1)
        else setPageState('finished')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pageState, index, corrections])

  // Render
  if (pageState === 'finished') {
    return (
      <Bloc type='full-body'>
        <div className='flex justify-center items-center'><h2 className='text-5xl font-bold'>{t('Finished')}!</h2></div>
        <CorrectionDisplay corrections={corrections} />
      </Bloc>
    )
  }

  const progress = pageState === 'options' || pageState === 'loadingExercise'
    ? `${exercises.length} ${t('Questions')}`
    : corrections.map((_, i) => {
      const corr = corrections[i] || []
      return corr.length
        ? (corr.every(c => c.correctOnFirstTry) ? '🟢' : corr.every(c => c.correct) ? '🟠' : '🔴')
        : '⚪'
    }).join('')

  return (
    <div className='grow flex m-4 gap-4'>
      <div className='grow flex flex-col items-center'>
        <Title title={exerciseData?.name} progress={progress} />
        <div className='overflow-y-scroll bg-neutral-900 rounded-3xl w-full p-4 text-3xl px-7 space-y-4'>
          {(pageState === 'options' || pageState === 'loadingExercise') ? (
            <Options
              options={optionsData}
              values={userOptions}
              onChange={(id, val) => setUserOptions(u => u.map(o => o.id === id ? { ...o, value: val } : o))}
              loading={pageState === 'loadingExercise'}
            />
          ) : (
            <ExerciseContent
              exercise={exercises[index]}
              index={index}
              refs={inputRefs}
              corrections={corrections[index] || []}
              disabled={i => pageState !== 'exercising' || corrections[index]?.[i]?.correct}
            />
          )}
        </div>
        <div className='mt-auto py-4 flex justify-center'>
          <ActionButtons
            state={pageState}
            corrections={corrections}
            idx={index}
            total={exercises.length}
            actions={{ start, confirm, retry: () => setPageState('exercising'), next: () => { setIndex(i => i + 1); setPageState('exercising') }, finish: () => setPageState('finished') }}
          />
        </div>
      </div>
    </div>
  )
}
