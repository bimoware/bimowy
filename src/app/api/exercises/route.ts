import { NextResponse } from 'next/server'
import db from '../db'

// To handle a GET request to /api
export async function GET() {
	return NextResponse.json(db, { status: 200 })
}
