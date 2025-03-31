import { NextResponse } from 'next/server'
import db from '../db'

// To handle a POST request to /api/generate-exercices
export async function POST(req: Request) {
	try {
		// Parse the incoming JSON body
		const { exercice_id, n } = await req.json()
		const exercice = db.find((ex) => ex.id === exercice_id)

		if (!exercice) {
			return NextResponse.json(
				{ message: `Exercice with ID '${exercice_id}' not found` },
				{ status: 404 }
			)
		} else {
			const questions = Array.from({ length: n || 5 }).map(() =>
				exercice.generate()
			)
			return NextResponse.json(questions)
		}
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ message: 'Invalid request format' },
			{ status: 400 }
		)
	}
}
