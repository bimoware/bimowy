import { NextResponse } from "next/server"

export function NextError(message: string | string[]) {
	return NextResponse.json({
		ok: false,
		message
	})
}

export function NextSuccess<T>(data: T) {
	return NextResponse.json({ ok: true, data })
}