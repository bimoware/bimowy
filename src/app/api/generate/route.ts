import { NextResponse } from 'next/server'
import db from '../db'
import { Language } from '../defs'

export async function POST(req: Request) {
  const {
    exercise_id,
    n,
    lang
  }: {
    exercise_id: string
    n?: number
    lang: Language
  } = await req.json()
  
  const exercise = (await db.fetch(exercise_id))!
  const exercises = Array.from({ length: n || 5 }).map(() => exercise.generate(lang))

  const exerciseJSON = exercise.serialize(lang)

  return NextResponse.json(
    { ...exerciseJSON, exercises },
    { status: 200 }
  )
}
