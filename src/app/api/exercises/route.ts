import { NextResponse } from 'next/server'
import db from '../db'

// To handle a GET request to /api
export async function GET() {
  const cache = await db.fetchAll()
  const values = Array.from(cache.values()).sort(
    (a, b) => a.createdOn - b.createdOn
  )
  return NextResponse.json(values, { status: 200 })
}
