import { NextResponse } from 'next/server'

export function Error(message: string) {
  return NextResponse.json({
    ok: false,
    status: 400,
    message
  })
}

export function Success(data: any) {
  return NextResponse.json({ ok: true, status: 200, data })
}

export function isValidLang(lang: string){
  return lang == "fr" || lang == "en"
}