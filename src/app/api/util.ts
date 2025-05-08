import { NextResponse } from "next/server"

export function Error(message: string | string[]) {
	return NextResponse.json({
		ok: false,
		message
	})
}

export function Success<T>(data: T) {
	return NextResponse.json({ ok: true, data })
}

export function isValidLang(lang: string) {
	return lang == "fr" || lang == "en"
}

export function randomFromInterval(
	min: number,
	max: number,
	exclude: number[] = []
) {
	const value = Math.floor(Math.random() * (max - min + 1)) + min
	if (value in exclude) return randomFromInterval(min, max, exclude)
	return value
}

export function randomFrom(arr: any[]) {
	return arr[Math.floor(Math.random() * arr.length)]
}
