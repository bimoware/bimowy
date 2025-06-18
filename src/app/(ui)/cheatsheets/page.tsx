import { Card, CardLister } from "@/cpn/Card";
import { getLocale, getTranslations } from "next-intl/server";
import db from '@api/ressources/main'
import { Language } from "@api/main";
import { CheatSheetBuilder } from "@api/ressources/cheatsheets/defs";
import { generateMetadataUtil } from "@util/sidebar";

export async function generateMetadata() {
	return generateMetadataUtil('cheatsheets')
}

export default async function CheatSheetsPage() {
	const t = await getTranslations('CheatSheetsPage')
	const lang = (await getLocale()) as Language
	const fetchedCheatSheets = (await db.fetchAllCheatSheets())
	const cheatSheets = Array.from(fetchedCheatSheets.values())
		.map(v => v.serialize(lang))

	return <CardLister title={t('cheatsheets')} >
		<CheatSheetsList {...{ cheatSheets }} />
	</CardLister >
}

function CheatSheetsList({ cheatSheets }: {
	cheatSheets: ReturnType<CheatSheetBuilder["serialize"]>[]
}) {
	return cheatSheets.map(cheatSheet => <Card
		{...cheatSheet}
		href={"/cheatsheets/" + cheatSheet.id}
		key={cheatSheet.id}
	/>)
}