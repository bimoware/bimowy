import { NextResponse } from "next/server"


// API Routing
export function NextError(message: string | string[]) {
	return NextResponse.json({
		ok: false,
		message
	})
}

export function NextSuccess<T>(data: T) {
	return NextResponse.json({ ok: true, data })
}

// Lang
export function isValidLang(lang: string) {
	return lang == "fr" || lang == "en"
}

// Random
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

// Exercises
export function randomNonZeroInt(min: number, max: number) {
	let pool = [];
	for (let i = min; i <= max; i++) {
		if (i !== 0) pool.push(i);
	}
	return pool[Math.floor(Math.random() * pool.length)];
}

export function factorial(n: number): number {
	return n * (n < 2 ? 1 : factorial(n - 1))
}

// Misc
export function sleep(seconds: number) {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}