import { NextResponse } from 'next/server'

export default function getInvalidMethodResponse(correctMethod: string) {
	return NextResponse.json(
		{ message: `The correct method for this route is ${correctMethod}.` },
		{ status: 405 }
	)
}
