"use client";
import { CheatSheetAllRouteResult } from "@app/api/cheatsheets/all/route"
import { Card, CardLister } from "@cpn/Card";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react"

export default function CheatSheetsPage() {
	const t = useTranslations('CheatSheetsPage')
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

	return <CardLister title={t('cheatsheets')}>
		<CheatSheetsList {...{ cheatSheets }} />
	</CardLister>
}

function CheatSheetsList({ cheatSheets }: { cheatSheets?: CheatSheetAllRouteResult }) {
	if (!cheatSheets) return Array.from({ length: 10 }).map((_, i) => <Card key={i} skeleton id={String(i)} />)
	return cheatSheets.map(cheatSheet => <Card
		id={cheatSheet.id}
		key={cheatSheet.id}
		data={{ ...cheatSheet, href: "/cheatsheets/" + cheatSheet.id }}

	/>)
}