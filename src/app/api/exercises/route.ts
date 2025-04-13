import { NextResponse } from 'next/server'
import db from '../db'
import { Language } from '../defs'

export async function POST(req: Request) {
  const { lang }: { lang: Language } = await req.json()

  const cache = await db.fetchAll()
  const values = Array.from(cache.values())
    .sort((a, b) => a.createdOn - b.createdOn)
    .map((ex) => ex.serialize(lang))
  return NextResponse.json(values, { status: 200 })
}
