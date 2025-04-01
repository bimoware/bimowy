'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { ExerciseResource } from '../api/defs';
import Link from 'next/link';
import { Bloc } from '@/components/Bloc';

export default function Page() {
  const [exercises, setExercices] = useState<ExerciseResource[]>([]);

  const fetchExercises = useCallback(async () => {
    try {
      const response = await fetch('/api/exercises');
      if (!response.ok) throw new Error('Failed to fetch exercises');
      const data: ExerciseResource[] = await response.json();
      setExercices(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return (
    <Bloc type="full-body">
      <div className="flex gap-5 flex-wrap">
        {exercises.map((exercise) => <Card key={exercise.id} exercise={exercise} />)}
      </div>
    </Bloc>
  );
}

function Card({ exercise }: { exercise: ExerciseResource }) {
  const randomFrom = useCallback((arr: string[]) => arr[Math.floor(Math.random() * arr.length)], []);

  const randomRotationClass = useMemo(() => {
    const classes = [
      ['hover:-rotate-0', 'hover:rotate-1', 'hover:-rotate-1'],
      ['hover:translate-x-0', 'hover:translate-x-1', 'hover:-translate-x-1'],
      ['hover:translate-y-0', 'hover:translate-y-1', 'hover:-translate-y-1']
    ];
    return classes.map(randomFrom).join(' ');
  }, [randomFrom]);

  return (
    <Link href={`/exercises/${exercise.id}`} className={`w-70 h-fit bg-neutral-700/20 p-4 rounded-xl
    flex flex-col self-center gap-2
    transition select-none cursor-pointer
    hover:ring-2 hover:scale-105 hover:shadow-2xl
    shadow-black inset-shadow-xs inset-shadow-white/5
    ${randomRotationClass}`}>
      <h4 className="self-center text-big">{exercise.name}</h4>
      <span className="text-basic">{exercise.desc}</span>
      {/* Tags */}
      <div className="flex gap-2">
        {exercise.tags.map(tag => <span key={tag}
          className="bg-main/30 px-2 py-1 rounded-full leading-4">{tag}</span>)}
      </div>

    </Link>
  );
}