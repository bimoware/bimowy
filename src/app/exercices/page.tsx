'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { ExerciceResource } from '../api/defs';
import Link from 'next/link';

export default function Page() {
  const [exercices, setExercices] = useState<ExerciceResource[]>([]);

  const fetchExercises = useCallback(async () => {
    try {
      const response = await fetch('/api/exercices');
      if (!response.ok) throw new Error('Failed to fetch exercices');
      const data: ExerciceResource[] = await response.json();
      setExercices(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return (
    <div className="flex gap-5 flex-wrap">
      {exercices.map((exercice) => <Card key={exercice.id} exercice={exercice} />)}
    </div>
  );
}

function Card({ exercice }: { exercice: ExerciceResource }) {
  const randomFrom = useCallback((arr: string[]) => arr[Math.floor(Math.random() * arr.length)], []);

  const randomRotationClass = useMemo(() => {
    const classes = [
      ['hover:-rotate-0', 'hover:rotate-1', 'hover:-rotate-1'/*, 'hover:rotate-2', 'hover:-rotate-2', 'hover:rotate-3', 'hover:-rotate-3'*/],
      ['hover:translate-x-0', 'hover:translate-x-1', 'hover:-translate-x-1'/*, 'hover:translate-x-2', 'hover:-translate-x-2'*/],
      ['hover:translate-y-0', 'hover:translate-y-1', 'hover:-translate-y-1'/*,'hover:translate-y-2', 'hover:-translate-y-2'*/]
    ];
    return classes.map(randomFrom).join(' ');
  }, [randomFrom]);

  return (
    <Link href={`/exercices/${exercice.id}`} className={`w-70 h-fit bg-neutral-700/20 p-4 rounded-xl
    flex flex-col self-center gap-2
    transition select-none cursor-pointer
    hover:ring-2 hover:scale-105 hover:shadow-2xl
    shadow-black inset-shadow-xs inset-shadow-white/5
    ${randomRotationClass}`}>
      <h4 className="self-center text-big">{exercice.name}</h4>
      <span className="text-basic">{exercice.desc}</span>
      {/* Tags */}
      <div className="flex gap-2">
        {exercice.tags.map(tag => <span key={tag}
          className="bg-main/30 px-2 py-1 rounded-full leading-4">{tag}</span>)}
      </div>

    </Link>
  );
}