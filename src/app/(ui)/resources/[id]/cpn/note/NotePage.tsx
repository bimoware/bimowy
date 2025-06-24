import { NoteBuilder } from "@api/lib/note";
import CheatSheetBlocContainer from "./CheatSheetBlocContainer";
import { CheatSheetContentElement } from "./CheatSheetContentElement";
import { LanguageCode } from "@util/locale";


export default function NotePage({ note, locale }: {
	locale: LanguageCode, note: ReturnType<NoteBuilder["serialize"]>

}) {
	return <div className="w-full justify-center">
		<h1>{note.name}</h1>
		<div className="flex items-center justify-center gap-10 flex-wrap">
			{note.content
				.map((bloc, i) => <CheatSheetBlocContainer
					key={i}
					title={bloc.names?.[locale]}>
					<CheatSheetContentElement {...{ bloc, locale }} />
				</CheatSheetBlocContainer>)}
		</div>
	</div>
}