import { useParams } from 'react-router'
import { Dispatch, RefObject, useEffect, useRef, useState } from 'react'
import { Correction, exercicePart, ExercicePartType } from '../../../server/defs'
import useSound from 'use-sound';
import LoadingIcon from '../components/LoadingIcon'

type pageState = 'not-started-yet' | 'ongoing' | 'correcting' | 'corrected' | 'finished'
type exerciceData = {
  seed: number[];
  exercice_id: string;
  parts: exercicePart[];
}


export default function ExercicePage() {
  const exercice_id = useParams().exercice_id!
  const [exerciceIndex, setExerciceIndex] = useState(0)
  const [pageState, setPageState] = useState<pageState>('not-started-yet')
  const [exercices, setExercices] = useState<exerciceData[]>([])
  const firstInputToFocus = useRef<HTMLInputElement>(null)
  const [playCorrect] = useSound('/sounds/correct.mp3')

  function handleEnter() {
    if (pageState === 'not-started-yet') return setPageState('ongoing')
    if (pageState === 'ongoing') {
      playCorrect()
      return setPageState('correcting')
    }
    if (pageState === 'corrected') {
      const allCorrect = exercices[exerciceIndex].parts
        .filter(part => part.type === ExercicePartType.Input)
        .every(part => part.correct);

      if (!allCorrect) return setPageState('ongoing')


      if (exerciceIndex === exercices.length - 1) return setPageState('finished')
      setPageState('ongoing')
      setExerciceIndex((prev) => prev + 1)
    }
  }

  // Auto Focus
  useEffect(() => {
    firstInputToFocus.current?.focus();
  });

  // Handle enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      handleEnter();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageState]);

  // Generate exercices
  useEffect(() => {
    fetch(`http://localhost:1230/api/generate-exercices/${exercice_id}`)
      .then((res) => res.json())
      .then((exerciceParts) => setExercices(exerciceParts))
  }, [])

  // Correcting
  useEffect(() => {
    if (pageState === 'correcting') {
      const exercice = exercices[exerciceIndex]
      const url = new URL('http://localhost:1230/api/validate-answers');
      const currentInputs = exercice.parts
        .filter((part) => part.type === ExercicePartType.Input)
        .map((part) => ({ id: part.id, value: part.value }))

      url.searchParams.append('id', exercice.exercice_id);
      url.searchParams.append('answers', JSON.stringify(currentInputs));
      url.searchParams.append('seed', JSON.stringify(exercice.seed));

      fetch(url)
        .then((res) => res.json())
        .then((correction: Correction[]) => {
          const newExercices = [...exercices]
          newExercices[exerciceIndex].parts = newExercices[exerciceIndex].parts.map(part => {
            if (part.type === ExercicePartType.Input) {
              const isCorrect = correction.find(c => c.id === part.id)!.correct
              return {
                ...part,
                correct: isCorrect,
                correctOnFirstTry: part.correctOnFirstTry ?? isCorrect
              }
            }
            return part
          })
          setPageState('corrected')
        })

    }
  }, [pageState])

  switch (pageState) {
    case 'not-started-yet':
      return <button onClick={handleEnter}>Start</button>
    case 'ongoing':
    case 'correcting':
    case 'corrected':
      if (!exercices.length) return <LoadingIcon />
      return (
        <div className='flex flex-col gap-4 text-big'>
          <p>
            Exercice {exerciceIndex + 1}/{exercices.length}
          </p>
          {!exercices[exerciceIndex] ? (
            <LoadingIcon />
          ) : (
            exercices[exerciceIndex].parts.map((exercicePart, i) => <ExercicePart
              pageState={pageState}
              exercicePart={exercicePart}
              exerciceIndex={exerciceIndex}
              i={i}
              exercices={exercices}
              setExercices={setExercices}
              firstInputToFocus={firstInputToFocus}
              key={`${exercicePart.type}-${exerciceIndex}-${i}`}
            />)
          )}
          <Buttons
            currentExercice={exercices[exerciceIndex]}
            pageState={pageState}
            exerciceIndex={exerciceIndex}
            exercicesLength={exercices.length}
            handleEnter={handleEnter}
            setPageState={setPageState}
          />
        </div>
      )
    case 'finished':
      console.log(exercices)
      return <p>Finished. GG</p>
  }
}

export function Buttons({
  currentExercice,
  pageState,
  exerciceIndex,
  exercicesLength,
  handleEnter,
  setPageState
}: {
  currentExercice: exerciceData
  pageState: pageState,
  exerciceIndex: number
  exercicesLength: number,
  handleEnter: () => any,
  setPageState: Dispatch<pageState>
}) {
  switch (pageState) {
    case 'correcting':
      return <span>Correcting...</span>
    case 'ongoing':
      return <button onClick={handleEnter}>Confirm</button>
    case 'corrected':
      const lastIndex = exercicesLength - 1
      const allCorrect = currentExercice.parts
        .filter(part => part.type === ExercicePartType.Input)
        .every(part => part.correct);

      return <div className='flex gap-4'>
        {
          allCorrect
            ? <></>
            : <button onClick={() => setPageState('ongoing')}>
              Retry
            </button>
        }
        <button onClick={handleEnter}>{exerciceIndex <= lastIndex ? "Next" : "Finish"}</button>
      </div>
  }
}

export function ExercicePart({
  pageState,
  exercicePart,
  exerciceIndex,
  i,
  exercices,
  setExercices,
  firstInputToFocus
}: {
  pageState: pageState,
  exercicePart: exercicePart,
  exerciceIndex: number,
  i: number,
  exercices: exerciceData[],
  setExercices: Dispatch<exerciceData[]>,
  firstInputToFocus: RefObject<HTMLInputElement | null>
}) {

  switch (exercicePart.type) {
    case ExercicePartType.Input:
      return <input
        ref={firstInputToFocus}
        type='text'
        value={exercicePart.value || ''}
        onChange={(e) => {
          const newExercices = [...exercices]
          if (newExercices[exerciceIndex].parts[i].type === ExercicePartType.Input) {
            newExercices[exerciceIndex].parts[i].value = e.target.value;
          }
          return setExercices(newExercices)
        }}
        disabled={pageState !== 'ongoing'}
      />

    case ExercicePartType.Text:
      return <span
        key={`text-${exerciceIndex}-${i}`}
      >{exercicePart.text}</span>
  }
}