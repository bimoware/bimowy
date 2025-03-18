import { NextResponse } from 'next/server'
import db from '../exercices/db'
import { ExerciceResource } from '@/app/api/exercices/defs'

// Handle a POST request to /api/validate-answers
export async function POST(req: Request) {
	try {
		// Parse the request body (expects JSON)
		const { exercice_id, answers, seed } = await req.json()

		// In case answers and seed are passed as strings, parse them.
		const parsedAnswers =
			typeof answers === 'string' ? JSON.parse(answers) : answers
		const parsedSeed = typeof seed === 'string' ? JSON.parse(seed) : seed

		const exercice = db.find((ex) => ex.id == exercice_id)
		if (!exercice) {
			return NextResponse.json(
				{ message: `Exercice with ID '${exercice_id}' not found` },
				{ status: 404 }
			)
		} else if (!(exercice instanceof ExerciceResource)) {
			return NextResponse.json(
				{ message: 'Exercice is not an exercice resource' },
				{ status: 400 }
			)
		} else {
			const correction = exercice.validateAnswers(
				parsedSeed,
				parsedAnswers
			)
			return NextResponse.json(correction)
		}
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ message: 'Invalid request format' },
			{ status: 400 }
		)
	}
}
