'use client';

import React, { Dispatch, RefObject, useCallback, useEffect, useRef, useState, memo } from 'react';
import { useParams } from 'next/navigation';
import { Correction, exercicePart, ExercicePartType } from '@/app/api/exercices/defs';

type PageState = 'not-started-yet' | 'ongoing' | 'correcting' | 'corrected' | 'finished';

type ExerciceData = {
  seed: number[];
  exercice_id: string;
  parts: exercicePart[];
};

export default function ExercicePage() {
  const params = useParams();
  const exercice_id = params.exercice_id;
  const [exerciceIndex, setExerciceIndex] = useState(0);
  const [pageState, setPageState] = useState<PageState>('not-started-yet');
  const [exercices, setExercices] = useState<ExerciceData[]>([]);
  const firstInputToFocus = useRef<HTMLInputElement>(null);

  const handleEnter = useCallback(() => {
    if (pageState === 'not-started-yet') return setPageState('ongoing');
    if (pageState === 'ongoing') return setPageState('correcting');
    if (pageState === 'corrected') {
      const allCorrect = exercices[exerciceIndex]?.parts
        .filter(part => part.type === ExercicePartType.Input)
        .every(part => part.correct);

      if (!allCorrect) return setPageState('ongoing');

      if (exerciceIndex === exercices.length - 1) return setPageState('finished');
      setExerciceIndex(prev => prev + 1);
      setPageState('ongoing');
    }
  }, [pageState, exerciceIndex, exercices]);

  useEffect(() => {
    firstInputToFocus.current?.focus();
  }, [pageState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleEnter();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter]);

  useEffect(() => {
    if (!exercice_id) return;
    fetch('/api/generate/', {
      method: 'POST',
      body: JSON.stringify({ exercice_id, n: 5 })
    })
      .then((res) => res.json())
      .then((exerciceParts) => {
        setExercices(exerciceParts);
      });
  }, [exercice_id]);

  useEffect(() => {
    if (pageState !== 'correcting') return;
    const exercice = exercices[exerciceIndex];
    if (!exercice) return;

    const currentInputs = exercice.parts
      .filter(part => part.type === ExercicePartType.Input)
      .map(part => ({ id: part.id, value: part.value }));

    fetch("/api/validate", {
      method: 'POST',
      body: JSON.stringify({ exercice_id, answers: currentInputs, seed: exercice.seed })
    })
      .then((res) => res.json())
      .then((correction: Correction[]) => {
        setExercices(prevExercices => {
          const newExercices = [...prevExercices];
          newExercices[exerciceIndex] = {
            ...newExercices[exerciceIndex],
            parts: newExercices[exerciceIndex].parts.map(part => {
              if (part.type === ExercicePartType.Input) {
                const isCorrect = correction.find(c => c.id === part.id)?.correct;
                return {
                  ...part,
                  correct: isCorrect,
                  correctOnFirstTry: part.correctOnFirstTry ?? isCorrect
                };
              }
              return part;
            })
          };
          return newExercices;
        });
        setPageState('corrected');
      });
  }, [pageState, exerciceIndex, exercice_id, exercices]);


  useEffect(() => {
    if (pageState === 'finished') { console.log(exercices) };
  }, [pageState, exercices]);

  switch (pageState) {
    case 'not-started-yet':
      return <button onClick={handleEnter}>Start</button>;
    case 'finished':
      return <p>Finished. GG</p>;
    case 'ongoing':
    case 'correcting':
    case 'corrected':
      if (!exercices.length) return <>No exercices</>;
      return (
        <div className="flex flex-col gap-4 text-big">
          <p>
            Exercice {exerciceIndex + 1}/{exercices.length}
          </p>
          {exercices[exerciceIndex] ? (
            exercices[exerciceIndex].parts.map((exercicePart, i) => (
              <ExercicePart
                key={`${exercicePart.type}-${exerciceIndex}-${i}`}
                pageState={pageState}
                exercicePart={exercicePart}
                exerciceIndex={exerciceIndex}
                i={i}
                setExercices={setExercices}
                firstInputToFocus={firstInputToFocus}
              />
            ))
          ) : (
            <>No exercice yet..</>
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
    default:
      return null;
  }
}

const Buttons = memo(function Buttons({
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
          {!allCorrect && <button onClick={() => setPageState('ongoing')}>Retry</button>}
          <button onClick={handleEnter}>
            {exerciceIndex < lastIndex ? 'Next' : 'Finish'}
          </button>
        </div>
      );
    default:
      return <></>;
  }
});

const ExercicePart = memo(function ExercicePart({
  pageState,
  exercicePart,
  exerciceIndex,
  i,
  setExercices,
  firstInputToFocus
}: {
  pageState: PageState;
  exercicePart: exercicePart;
  exerciceIndex: number;
  i: number;
  setExercices: Dispatch<ExerciceData[] | ((prevExercices: ExerciceData[]) => ExerciceData[])>;
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
            setExercices(prevExercices => {
              const newExercices = [...prevExercices];
              newExercices[exerciceIndex] = {
                ...newExercices[exerciceIndex],
                parts: newExercices[exerciceIndex].parts.map((part, index) =>
                  index === i && part.type === ExercicePartType.Input
                    ? { ...part, value: e.target.value }
                    : part
                )
              };
              return newExercices;
            });
          }}
          disabled={pageState !== 'ongoing'}
        />
      );
    case ExercicePartType.Text:
      return <span key={`text-${exerciceIndex}-${i}`}>{exercicePart.text}</span>;
    default:
      return <></>;
  }
});