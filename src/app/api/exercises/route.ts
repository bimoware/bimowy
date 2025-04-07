import { NextResponse } from 'next/server'
import db from '../db'
import { LanguageCode } from '../defs'

export async function POST(req: Request) {
  const { lang }: { lang: LanguageCode } = await req.json()

  const cache = await db.fetchAll()
  const values = Array.from(cache.values())
    .sort((a, b) => a.createdOn - b.createdOn)
    .map((ex) => ({
      name: ex.name[lang],
      desc: ex.desc ? ex.desc[lang] : null,
      recent: ex.recent,
      id: ex.id,
      createdOn: ex.createdOn,
      tags: ex.tags
    }))

  console.log(values)
  return NextResponse.json(values, { status: 200 })
}
