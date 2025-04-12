import { NextResponse } from 'next/server'
import db from '../db'

export async function GET(req: Request) {
  const exercise = await db.fetch('addition')
  if (!exercise) return NextResponse.json({ no: 'no' })
  return NextResponse.json({
    solution: exercise.getDetailedSolution([1, 2])
  })
}
