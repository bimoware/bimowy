import { NextResponse } from 'next/server'
import db from '../db'

export async function POST(req: Request) {
  const { exercise_id, n } = await req.json()
  if (!exercise_id)
    return NextResponse.json(
      { message: 'exercise_id is required.' },
      { status: 400 }
    )
  if (typeof exercise_id !== 'string')
    return NextResponse.json(
      { message: 'exercise_id must be a string.' },
      { status: 400 }
    )
  if (!db.fetch(exercise_id))
    return NextResponse.json(
      {
        message: `Exercise with ID '${exercise_id}' not found`
      },
      { status: 404 }
    )
  if (n) {
    if (typeof n !== 'number')
      return NextResponse.json(
        { message: 'n must be a number.' },
        { status: 400 }
      )
    if (n % 1 !== 0)
      return NextResponse.json(
        { message: 'n must be an integer.' },
        { status: 400 }
      )
    if (n < 1 || n > 10)
      return NextResponse.json(
        {
          message: 'n must be in range 1 to 10 (inclusive).'
        },
        { status: 400 }
      )
  }
  const exercise = await db.fetch(exercise_id)

  if (!exercise) {
    return NextResponse.json(
      {
        message: `Exercise with ID '${exercise_id}' not found`
      },
      { status: 404 }
    )
  } else {
    const exercises = Array.from({ length: n || 10 }).map(
      () => exercise.generate()
    )
    return NextResponse.json(
      { ...exercise, exercises },
      { status: 200 }
    )
  }
}
