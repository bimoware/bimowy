'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { ExercisesRouteResult } from '@app/api/exercises/route'

export default function ExercisesPage() {
  const locale = useLocale()
  const [exercises, setExercises] = useState<ExercisesRouteResult>()

  const fetchExercises = useCallback(async () => {
    const res = await fetch(`/api/exercises?lang=${locale}`)
    const json = await res.json()
    setExercises(json.data as ExercisesRouteResult)
  }, [locale])

  useEffect(() => {
    fetchExercises()
  }, [fetchExercises])

  const classVariants = [
    'hover:-rotate-1',
    'hover:rotate-1',
    'hover:translate-x-1',
    'hover:-translate-x-1',
    'hover:translate-y-1',
    'hover:-translate-y-1'
  ]

  const skeletonDescs = [
    '.'.repeat(90),
    '.'.repeat(80),
    '.'.repeat(50),
    '',
    '.'.repeat(100),
    '.'.repeat(70),
  ]

  function getClassNameFromIndex(index: number) {
    const variant = classVariants[index % classVariants.length]
    return `${variant}
    w-fit h-fit p-4 px-8
    bg-neutral-700/20
    rounded-xl
    flex flex-col flex-wrap gap-1.5
    duration-150
    cursor-pointer
    hover:scale-105 hover:shadow-2xl hover:ring-2
    shadow-black/20 inset-shadow-xs inset-shadow-white/5
    group
    relative`
  }

  function getDescFromIndex(index: number) {
    return skeletonDescs[index % skeletonDescs.length]
  }

  return <section>
    <h1 className='text-center my-4 !text-5xl'>Sandbox</h1>
    <div className='!p-4 !h-fit flex gap-8 flex-wrap justify-center'>
      {
        exercises
          ? exercises.map((exercise, index) => (
            <Card key={exercise.id} exercise={exercise} className={getClassNameFromIndex(index)} />
          ))
          :
          Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} desc={getDescFromIndex(i)} className={getClassNameFromIndex(i)} />
          ))
      }
    </div>
  </section>
}

function Card({ exercise, className }: { exercise: ExercisesRouteResult[number], className: string }) {
  return (
    <Link
      href={`/sandbox/${exercise.id}`}
      className={`
        ${className}
        ${exercise.beta ? '!opacity-50 !hover:ring-1 !hover:ring-white/50' : ''}
      `}
    >
      {exercise.beta && (
        <Image
          src="/svgs/warning.svg"
          alt="Warning icon"
          width={35}
          height={35}
          className={`absolute
            -left-4 -top-4
            duration-150
            -rotate-6
            group-hover:scale-105 group-hover:rotate-2
            select-none`}
        />
      )}

      {/* {!exercise.beta && (
        <span className={`absolute
          px-3 py-1 -m-8
          -rotate-2 group-hover:-rotate-5 group-hover:-translate-1
          duration-150
          bg-indigo-800
          rounded-full
          font-bold
          group-hover:shadow-2xl group-hover:shadow-indigo-800`}>
          NEW
        </span>
      )} */}

      <h4>{exercise.name}</h4>
      <h5>{exercise.desc}</h5>

      <div className='flex gap-2 flex-wrap justify-center'>
        {exercise.tags.map(tag => (
          <span key={tag} className='bg-white/10 px-2 py-1 rounded-full leading-4'>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

function SkeletonCard({ className, desc }: { className: string, desc: string }) {
  return (
    <div className={`${className} !cursor-progress animate-pulse !duration-[50ms] *:opacity-0`}>
      <h4>{".".repeat(10)}</h4>
      <h5>{desc}</h5>
      <div className='flex gap-2 flex-wrap justify-center'>
        {[""].map(tag => (
          <span key={tag} className='bg-white/10 px-2 py-1 rounded-full leading-4'>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
