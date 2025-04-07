import { NextResponse } from 'next/server'
import db from '../db'

export async function POST(req: Request) {
  const { lang } = await req.json()
  if (!lang)
    return NextResponse.json(
      { message: 'lang is required.' },
      { status: 400 }
    )
  if (typeof lang !== 'string')
    return NextResponse.json(
      { message: 'lang must be a string.' },
      { status: 400 }
    )
  if (lang !== 'en' && lang !== 'fr')
    return NextResponse.json(
      { message: 'lang must be either "en" or "fr".' },
      { status: 400 }
    )

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
  return NextResponse.json(values, { status: 200 })
}
