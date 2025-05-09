"use client";
import { useParams } from "next/navigation"

export default function CheatSheetPage() {
	const { cheatsheet_id } = useParams()
	return <span>{cheatsheet_id}</span>
}