'use client'
import {
  useEffect,
  useMemo,
  useState,
  useCallback
} from 'react'
import Link from 'next/link'
import { Bloc } from '@cpn/Bloc'
import { useLocale } from 'next-intl'

type ExerciseJSON = {
  id: string
  name: string
  desc: string | null
  recent: boolean
  tags: string[]
}

export default function ExercisesPage() {
  const locale = useLocale();
  const [exercises, setExercices] = useState<ExerciseJSON[]>([])

  const fetchExercises = useCallback(async () => {
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lang: locale })
      })
      const data: ExerciseJSON[] =
        await response.json()
      setExercices(data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    fetchExercises()
  }, [fetchExercises])

  return (
    <Bloc type='full-body'>
      <div className='flex gap-8 flex-wrap'>
        {exercises.map((exercise) => (
          <Card key={exercise.id} {...{ exercise }} />
        ))}
      </div>
    </Bloc>
  )
}

function Card({
  exercise
}: {

  exercise: ExerciseJSON
}) {
  const randomFrom = useCallback(
    (arr: string[]) =>
      arr[Math.floor(Math.random() * arr.length)],
    []
  )

  const randomRotationClass = useMemo(() => {
    const classes = [
      [
        'hover:-rotate-0',
        'hover:rotate-1',
        'hover:-rotate-1'
      ],
      [
        'hover:translate-x-0',
        'hover:translate-x-1',
        'hover:-translate-x-1'
      ],
      [
        'hover:translate-y-0',
        'hover:translate-y-1',
        'hover:-translate-y-1'
      ]
    ]
    return classes.map(randomFrom).join(' ')
  }, [randomFrom])

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className={`w-fit h-fit bg-neutral-700/20 rounded-xl
    p-4 px-8
    flex flex-col self-center gap-0.5
    duration-150
    select-none cursor-pointer
    hover:ring-2 hover:scale-105 hover:shadow-2xl
    shadow-black/20 inset-shadow-xs inset-shadow-white/5
    group
    ${randomRotationClass}`}
    >
      {exercise.recent && (
        <span
          className='absolute px-3 py-1 -m-8 group-hover:-rotate-5 group-hover:-translate-1
        transition-transform
        bg-indigo-800 rounded-full -rotate-2 font-bold
        '
        >
          NEW
        </span>
      )}
      <h4 className='self-center text-2xl font-bold'>
        {exercise.name}
      </h4>
      <span className='self-center text-basic text-[0em] group-hover:text-sm text-neutral-50/50 
      duration-150'>
        {exercise.desc}
      </span>
      {/* Tags */}
      <div className='flex gap-2 flex-wrap mt-2 justify-center'>
        {exercise.tags.map((tag) => (
          <span
            key={tag}
            className='bg-white/10 px-2 py-1 rounded-full leading-4'
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
