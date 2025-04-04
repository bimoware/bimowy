import { NextResponse } from 'next/server'
import { ExerciseGenerator } from '@app/api/defs'
import db from '../db'

// Handle a POST request to /api/validate-answers
export async function POST(req: Request) {
	try {
		// Parse the request body (expects JSON)
		const { exercise_id, answers, seed } = await req.json()

		// In case answers and seed are passed as strings, parse them.
		const parsedAnswers =
			typeof answers === 'string' ? JSON.parse(answers) : answers
		const parsedSeed = typeof seed === 'string' ? JSON.parse(seed) : seed

		const exercise = db.find((ex) => ex.id == exercise_id)
		if (!exercise) {
			return NextResponse.json(
				{ message: `Exercise with ID '${exercise_id}' not found` },
				{ status: 404 }
			)
		} else if (!(exercise instanceof ExerciseGenerator)) {
			return NextResponse.json(
				{ message: 'Exercise is not an exercise resource' },
				{ status: 400 }
			)
		} else {
			const correction = exercise.validateAnswers(
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
