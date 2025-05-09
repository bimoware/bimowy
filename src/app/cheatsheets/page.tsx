"use client";
import { CheatSheetAllRouteResult } from "@app/api/cheatsheets/all/route"
import Card from "@cpn/Card";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react"

export default function CheatSheetsPage() {
	const [cheatSheets, setCheatSheets] = useState<CheatSheetAllRouteResult>();
	const lang = useLocale()
	useEffect(() => {
		fetch(`/api/cheatsheets/all?lang=${lang}`)
			.then(res => res.json())
			.then(res => res.data)
			.then((data: CheatSheetAllRouteResult) => {
				setCheatSheets(data)
			})
	}, [])

	return <>
		<h1>Cheat Sheets</h1>
		<div className="flex p-4 gap-6 w-full flex-wrap justify-center items-center">
			<CheatSheetsList {...{ cheatSheets }} />
		</div>
	</>
}

function CheatSheetsList({ cheatSheets }: { cheatSheets?: CheatSheetAllRouteResult }) {
	if (!cheatSheets) return Array.from({ length: 10 }).map((_, i) => <Card key={i} skeleton id={String(i)} />)
	return cheatSheets.map(cheatSheet => <Card
		id={cheatSheet.id}
		key={cheatSheet.id}
		data={{ ...cheatSheet, href: "/cheatsheets/" + cheatSheet.id }}

	/>)
}