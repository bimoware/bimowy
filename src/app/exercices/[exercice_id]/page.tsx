'use client';

import { useParams } from 'next/navigation';
import { Dispatch, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Correction, exercicePart, ExercicePartType } from '@/app/api/exercices/defs';

type PageState = 'not-started-yet' | 'ongoing' | 'correcting' | 'corrected' | 'finished';

type ExerciceData = {
  seed: number[];
  exercice_id: string;
  parts: exercicePart[];
};

export default function ExercicePage() {
  // In Next.js, we get URL params using next/navigation’s useParams hook.
  const params = useParams();
  const exercice_id = params.exercice_id; // Assumes URL is /exercices/[exercice_id]
  const [exerciceIndex, setExerciceIndex] = useState(0);
  const [pageState, setPageState] = useState<PageState>('not-started-yet');
  const [exercices, setExercices] = useState<ExerciceData[]>([]);
  const firstInputToFocus = useRef<HTMLInputElement>(null);
  const handleEnter = useCallback(() => {
    if (pageState === 'not-started-yet') return setPageState('ongoing');
    if (pageState === 'ongoing') return setPageState('correcting');
    if (pageState === 'corrected') {
      const allCorrect = exercices[exerciceIndex].parts
        .filter(part => part.type === ExercicePartType.Input)
        .every(part => part.correct);

      if (!allCorrect) return setPageState('ongoing');

      if (exerciceIndex === exercices.length - 1) return setPageState('finished');
      setPageState('ongoing');
      setExerciceIndex((prev) => prev + 1);
    }
  }, [pageState, exerciceIndex, exercices]);


  // Auto-focus on the first input when needed.
  useEffect(() => {
    firstInputToFocus.current?.focus();
  }, [handleEnter, pageState]);

  // Listen for the "Enter" key.
  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      handleEnter();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter, pageState]);

  // Generate exercices from the API using the exercice_id param.
  useEffect(() => {
    if (!exercice_id) return;
    fetch('/api/generate/', {
      method: 'POST',
      body: JSON.stringify({ exercice_id, n: 5 }) // Send the exercice_id as data
    })
      .then((res) => res.json())
      .then(res => { console.log(res); return res })
      .then((exerciceParts) => setExercices(exerciceParts));
  }, [exercice_id]);

  // When in "correcting" state, call the API to validate answers.
  useEffect(() => {
    if (pageState === 'correcting') {
      const exercice = exercices[exerciceIndex];
      if (!exercice) return;
      const currentInputs = exercice.parts
        .filter((part) => part.type === ExercicePartType.Input)
        .map((part) => ({ id: part.id, value: part.value }));


      fetch("/api/validate", {
        method: 'POST',
        body: JSON.stringify({ exercice_id, answers: currentInputs, seed: exercice.seed })
      })
        .then((res) => res.json())
        .then((correction: Correction[]) => {
          const newExercices = [...exercices];
          newExercices[exerciceIndex].parts = newExercices[exerciceIndex].parts.map(part => {
            if (part.type === ExercicePartType.Input) {
              const isCorrect = correction.find(c => c.id === part.id)!.correct;
              return {
                ...part,
                correct: isCorrect,
                correctOnFirstTry: part.correctOnFirstTry ?? isCorrect
              };
            }
            return part;
          });
          setExercices(newExercices);
          setPageState('corrected');
        });
    }
  }, [pageState, exercices, exerciceIndex, exercice_id]);

  switch (pageState) {
    case 'not-started-yet':
      return <button onClick={handleEnter}>Start</button>;
    case 'ongoing':
    case 'correcting':
    case 'corrected':
      if (!exercices.length) return <>No exercices</>
      return (
        <div className="flex flex-col gap-4 text-big">
          <p>
            Exercice {exerciceIndex + 1}/{exercices.length}
          </p>
          {!exercices[exerciceIndex] ? (
            <>No exercice yet..</>
          ) : (
            exercices[exerciceIndex].parts.map((exercicePart, i) => (
              <ExercicePart
                pageState={pageState}
                exercicePart={exercicePart}
                exerciceIndex={exerciceIndex}
                i={i}
                exercices={exercices}
                setExercices={setExercices}
                firstInputToFocus={firstInputToFocus}
                key={`${exercicePart.type}-${exerciceIndex}-${i}`}
              />
            ))
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
      );
    case 'finished':
      console.log(exercices);
      return <p>Finished. GG</p>;
    default:
      return null;
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
  currentExercice: ExerciceData;
  pageState: PageState;
  exerciceIndex: number;
  exercicesLength: number;
  handleEnter: () => void;
  setPageState: Dispatch<PageState>;
}) {
  switch (pageState) {
    case 'correcting':
      return <span>Correcting...</span>;
    case 'ongoing':
      return <button onClick={handleEnter}>Confirm</button>;
    case 'corrected':
      const lastIndex = exercicesLength - 1;
      const allCorrect = currentExercice.parts
        .filter(part => part.type === ExercicePartType.Input)
        .every(part => part.correct);
      return (
        <div className="flex gap-4">
          {allCorrect ? null : (
            <button onClick={() => setPageState('ongoing')}>Retry</button>
          )}
          <button onClick={handleEnter}>
            {exerciceIndex <= lastIndex ? 'Next' : 'Finish'}
          </button>
        </div>
      );
    default:
      return null;
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
  pageState: PageState;
  exercicePart: exercicePart;
  exerciceIndex: number;
  i: number;
  exercices: ExerciceData[];
  setExercices: Dispatch<ExerciceData[]>;
  firstInputToFocus: RefObject<HTMLInputElement | null>;
}) {
  switch (exercicePart.type) {
    case ExercicePartType.Input:
      return (
        <input
          ref={firstInputToFocus}
          type="text"
          value={exercicePart.value || ''}
          onChange={(e) => {
            const newExercices = [...exercices];
            if (newExercices[exerciceIndex].parts[i].type === ExercicePartType.Input) {
              newExercices[exerciceIndex].parts[i].value = e.target.value;
            }
            setExercices(newExercices);
          }}
          disabled={pageState !== 'ongoing'}
        />
      );
    case ExercicePartType.Text:
      return (
        <span key={`text-${exerciceIndex}-${i}`}>
          {exercicePart.text}
        </span>
      );
    default:
      return null;
  }
}
