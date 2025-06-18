import { generateMetadataUtil, getRoute, MetadataGenerationProps } from "@util/sidebar";
import db from "@api/ressources/main";
import { Language } from "@api/main";
import { getLocale } from "next-intl/server";
import CheatSheetBlocContainer from "@app/(ui)/cheatsheets/[cheatsheet_id]/cpn/CheatSheetBlocContainer";
import 'katex/dist/katex.min.css';
import Image from "next/image";
import { CheatSheetContentElement } from "./cpn/CheatSheetContentElement";

export async function generateMetadata({ params }: MetadataGenerationProps<["cheatsheet_id"]>) {
	const locale = await getLocale() as Language
	const { cheatsheet_id } = await params;
	const cheatSheet = await db.fetchCheatSheet(cheatsheet_id)

	if (cheatSheet) return await generateMetadataUtil('cheatsheets', cheatSheet.serialize(locale).name);
}

export default async function CheatSheetPage({ params }: {
	params: Promise<{ cheatsheet_id: string }>
}) {
	const locale = (await getLocale()) as Language
	const { cheatsheet_id } = await params
	const fetchedCheatSheet = await db.fetchCheatSheet(cheatsheet_id)
	const cheatSheet = fetchedCheatSheet.serialize(locale)

	return <div className="w-full justify-center">
		<h1>{cheatSheet.name}</h1>
		<div className="flex items-center justify-center gap-10 flex-wrap">
			{cheatSheet.content
				.map((bloc, i) => <CheatSheetBlocContainer key={i} title={bloc.title && bloc.title[locale]}>
					<CheatSheetContentElement {...{ bloc, locale }} />
				</CheatSheetBlocContainer>)}
		</div>
		<div className="flex items-center justify-center mt-10">
			{
				cheatSheet.todo
				&& <CheatSheetBlocContainer key={"todo"} title={"TODO"}>
					<div>
						{
							cheatSheet.todo.map((t, i) => <p className="inline-flex items-center" key={i}>
								<Image src={"/svgs/checkbox.svg"} width={50} height={50} alt={"checkbox"}
									className="inline h-4 select-none" />
								{t[locale]}
							</p>)
						}
					</div>
				</CheatSheetBlocContainer>
			}
		</div>
	</div>
}