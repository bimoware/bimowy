import { NextResponse } from "next/server"
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

export function isValidLang(lang: string) {
	return lang == "fr" || lang == "en"
}

export function randomFromRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom(arr: any[]) {
	return arr[Math.floor(Math.random() * arr.length)]
}

export const DEFAULT_OPTION = {
	title: { en: "Number of questions", fr: "Nombre de questions" },
	id: "_n",
	type: "number",
	min: 1,
	max: 15,
	defaultValue: 5
} as const
