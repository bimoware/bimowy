'use client';

import React, { Dispatch, RefObject, useCallback, useEffect, useRef, useState, memo } from 'react';
import { useParams } from 'next/navigation';
import { Correction, ExerciceInput } from '@/app/api/defs';

type PageState = 'not-started-yet' | 'ongoing' | 'correcting' | 'corrected' | 'finished';

type ExerciceData = {
  exercise_id: string;
  seed: number[];
  context: string[];
  inputs: ExerciceInput[];
}

export default function ExercicePage() {
  const params = useParams();
  const exercise_id = params.exercise_id;
  const [exerciseIndex, setExerciceIndex] = useState(0);
  const [pageState, setPageState] = useState<PageState>('not-started-yet');
  const [exercises, setExercices] = useState<ExerciceData[]>([]);
  const firstInputToFocus = useRef<HTMLInputElement>(null);

  // Handle pageState when ENTER key is pressed
  const handleEnter = useCallback(() => {
    if (pageState === 'not-started-yet') return setPageState('ongoing');
    if (pageState === 'ongoing') return setPageState('correcting');
    if (pageState === 'corrected') {
      const allCorrect = exercises[exerciseIndex]?.parts
        .filter(part => part.type === ExercicePartType.Input)
        .every(part => part.correct);

      if (!allCorrect) return setPageState('ongoing');

      if (exerciseIndex === exercises.length - 1) return setPageState('finished');
      setExerciceIndex(prev => prev + 1);
      setPageState('ongoing');
    }
  }, [pageState, exerciseIndex, exercises]);

  // Focus on the first input everytime the pageState changes (and current is something lol)
  useEffect(() => {
    if (!firstInputToFocus.current) return;
    firstInputToFocus.current.focus();
    firstInputToFocus.current.select();
  }, [pageState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleEnter();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter]);

  useEffect(() => {
    if (!exercise_id) return;
    fetch('/api/generate/', {
      method: 'POST',
      body: JSON.stringify({ exercise_id, n: 5 })
    })
      .then((res) => res.json())
      .then((exerciseParts) => {
        setExercices(exerciseParts);
      });
  }, [exercise_id]);

  useEffect(() => {
    if (pageState !== 'correcting') return;
    const exercise = exercises[exerciseIndex];
    if (!exercise) return;

    const currentInputs = exercise.parts
      .filter(part => part.type === ExercicePartType.Input)
      .map(part => ({ id: part.id, value: part.value }));

    fetch("/api/validate", {
      method: 'POST',
      body: JSON.stringify({ exercise_id, answers: currentInputs, seed: exercise.seed })
    })
      .then((res) => res.json())
      .then((correction: Correction[]) => {
        setExercices(prevExercices => {
          const newExercices = [...prevExercices];
          newExercices[exerciseIndex] = {
            ...newExercices[exerciseIndex],
            parts: newExercices[exerciseIndex].parts.map(part => {
              if (part.type === ExercicePartType.Input) {
                const isCorrect = correction.find(c => c.id === part.id)?.is_correct;
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
  }, [pageState, exerciseIndex, exercise_id, exercises]);


  useEffect(() => {
    if (pageState === 'finished') { console.log(exercises) };
  }, [pageState, exercises]);

  switch (pageState) {
    case 'not-started-yet':
      return <button onClick={handleEnter}>Start</button>;
    case 'finished':
      return <p>Finished. GG</p>;
    case 'ongoing':
    case 'correcting':
    case 'corrected':
      if (!exercises.length) return <>No exercises</>;
      return (
        <div className="flex flex-col gap-4 text-big">
          <p>
            Exercise {exerciseIndex + 1}/{exercises.length}
          </p>
          {exercises[exerciseIndex] ? (
            exercises[exerciseIndex].parts.map((exercisePart, i) => (
              <ExercicePart
                key={`${exercisePart.type}-${exerciseIndex}-${i}`}
                pageState={pageState}
                exercisePart={exercisePart}
                exerciseIndex={exerciseIndex}
                i={i}
                setExercices={setExercices}
                firstInputToFocus={firstInputToFocus}
              />
            ))
          ) : (
            <>No exercise yet..</>
          )}
          <Buttons
            currentExercice={exercises[exerciseIndex]}
            pageState={pageState}
            exerciseIndex={exerciseIndex}
            exercisesLength={exercises.length}
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
  exerciseIndex,
  exercisesLength,
  handleEnter,
  setPageState
}: {
  currentExercice: ExerciceData;
  pageState: PageState;
  exerciseIndex: number;
  exercisesLength: number;
  handleEnter: () => void;
  setPageState: Dispatch<PageState>;
}) {
  switch (pageState) {
    case 'correcting':
      return <span>Correcting...</span>;
    case 'ongoing':
      return <button onClick={handleEnter}>Confirm</button>;
    case 'corrected':
      const lastIndex = exercisesLength - 1;
      const allCorrect = currentExercice.parts
        .filter(part => part.type === ExercicePartType.Input)
        .every(part => part.correct);
      return (
        <div className="flex gap-4">
          {!allCorrect && <button onClick={() => setPageState('ongoing')}>Retry</button>}
          <button onClick={handleEnter}>
            {exerciseIndex < lastIndex ? 'Next' : 'Finish'}
          </button>
        </div>
      );
    default:
      return <></>;
  }
});

const ExercicePart = memo(function ExercicePart({
  pageState,
  exercisePart,
  exerciseIndex,
  i,
  setExercices,
  firstInputToFocus
}: {
  pageState: PageState;
  exercisePart: exercisePart;
  exerciseIndex: number;
  i: number;
  setExercices: Dispatch<ExerciceData[] | ((prevExercices: ExerciceData[]) => ExerciceData[])>;
  firstInputToFocus: RefObject<HTMLInputElement | null>;
}) {
  switch (exercisePart.type) {
    case ExercicePartType.Input:
      return (
        <input
          ref={firstInputToFocus}
          type="text"
          value={exercisePart.value || ''}
          onChange={(e) => {
            setExercices(prevExercices => {
              const newExercices = [...prevExercices];
              newExercices[exerciseIndex] = {
                ...newExercices[exerciseIndex],
                parts: newExercices[exerciseIndex].parts.map((part, index) =>
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
      return <span key={`text-${exerciseIndex}-${i}`}>{exercisePart.text}</span>;
    default:
      return <></>;
  }
});