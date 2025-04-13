import { NextResponse } from 'next/server'
import db from '../db'
import { Language } from '../defs'

export async function POST(req: Request) {
  const {
    exercise_id,
    lang
  }: {
    exercise_id: string
    lang: Language
  } = await req.json()

  const exercise = (await db.fetch(exercise_id))!
  const exerciseJSON = exercise.serialize(lang)
}
