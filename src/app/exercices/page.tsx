'use client'; 
import { useEffect, useMemo, useState } from 'react';
import { ExerciceResource } from '../api/exercices/defs';
import Link from 'next/link';

export default function Page() {
  const [exercices, setExercices] = useState<ExerciceResource[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      const response = await fetch('/api/exercices');
      if (response.ok) {
        const data: ExerciceResource[] = await response.json();
        setExercices(data);
      }
    };

    fetchExercises();
  }, []);

  return (
    <div className="flex gap-5">
      {exercices.map((ex) => (
        <Card
          key={ex.id}
          name={ex.name}
          content={ex.desc}
          href={'/exercices/' + ex.id}
        />
      ))}
    </div>
  );
}

interface CardProps {
  name: string;
  content: string;
  href: string;
}

function Card({ name, content, href }: CardProps) {
  const randomFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const randomRotationClass = useMemo(() => {
    const rotationClasses = [
      'hover:rotate-1',
      'hover:-rotate-1',
      'hover:rotate-2',
      'hover:-rotate-2',
      'hover:rotate-3',
      'hover:-rotate-3',
    ];

    const translationXClasses = [
      'hover:translate-x-0',
      'hover:translate-x-1',
      'hover:-translate-x-1',
      'hover:translate-x-2',
      'hover:-translate-x-2',
    ];

    const translationYClasses = [
      'hover:translate-y-0',
      'hover:translate-y-1',
      'hover:-translate-y-1',
      'hover:translate-y-2',
      'hover:-translate-y-2',
    ];

    return [rotationClasses, translationXClasses, translationYClasses].map(randomFrom);
  }, []);

  return (
    <Link href={href}>
      <div
        className={`w-70 bg-neutral-700/20 p-4 rounded-xl flex flex-col self-center h-fit transition cursor-pointer hover:ring-2 hover:scale-105 ${randomRotationClass.join(' ')} hover:shadow-2xl shadow-black inset-shadow-xs inset-shadow-white/5 select-none`}
      >
        <h4 className="self-center text-big">{name}</h4>
        <span className="text-basic">{content}</span>
      </div>
    </Link>
  );
}
