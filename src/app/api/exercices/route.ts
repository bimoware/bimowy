import { NextResponse } from "next/server";
import db from './exercices_db';

// To handle a GET request to /api
export async function GET() {
  // Do whatever you want
  return NextResponse.json(db, { status: 200 });
}

