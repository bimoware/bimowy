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
import Image from 'next/image'

type ExerciseData = {
  id: string
  name: string
  desc: string | null
  beta: boolean
  recent: boolean
  tags: string[]
}

export default function ExercisesPage() {
  const locale = useLocale();
  const [exercises, setExercices] = useState<ExerciseData[]>([])

  const fetchExercises = useCallback(async () => {
    return await fetch(`/api/exercises?lang=${locale}`)
      .then(res => res.json())
      .then(res => res.data)
      .then((data: ExerciseData[]) => setExercices(data))
  }, [])

  useEffect(() => {
    fetchExercises()
  }, [])

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
  exercise: ExerciseData
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
        'hover:translate-x-1',
        'hover:-translate-x-1'
      ],
      [
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
    cursor-pointer
    hover:scale-105 hover:shadow-2xl
    shadow-black/20 inset-shadow-xs inset-shadow-white/5
    group relative
    ${randomRotationClass}
    ${exercise.beta
          ? `**:opacity-50 hover:ring-1 hover:ring-white/50`
          : "hover:ring-2"}`}
    >
      {
        exercise.beta ? (
          <Image src={"/svgs/warning.svg"} alt={"Warning icon"} width={40} height={40}
            className="absolute -left-5 -top-5
          duration-150
          -rotate-6
          group-hover:scale-105 group-hover:rotate-2
          select-none
          " />
        )
          : exercise.recent && (
            <span
              className='absolute px-3 py-1 -m-8 group-hover:-rotate-5 group-hover:-translate-1
        transition-transform
        bg-indigo-800 rounded-full -rotate-2 font-bold
        shadow-2xl shadow-indigo-800'
            >
              NEW
            </span>
          )}

      <h4 className='self-center text-2xl font-bold'>
        {exercise.name}
      </h4>
      <span className='self-center text-basic text-sm text-neutral-50/50
      duration-150 text-wrap'>
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
