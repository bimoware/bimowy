import { NextResponse } from 'next/server'
import db from '../db'
import { ExerciseGenerator } from '../defs'

export async function POST(req: Request) {
  const {
    exercise_id,
    n,
    lang
  }: {
    exercise_id: string
    n?: number
    lang: 'en' | 'fr'
  } = await req.json()
  const exercise = await db.fetch(exercise_id) as ExerciseGenerator

  const exercises = Array.from({ length: n || 5 }).map(() =>
    exercise.generate(lang)
  )
  const newExercise = [exercise].map((ex) => ({
    name: ex.name[lang],
    desc: ex.desc ? ex.desc[lang] : null,
    recent: ex.recent,
    id: ex.id,
    createdOn: ex.createdOn,
    tags: ex.tags
  }))[0]

  return NextResponse.json(
    { ...newExercise, exercises },
    { status: 200 }
  )
}
