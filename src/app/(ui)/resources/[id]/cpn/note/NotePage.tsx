import { NoteBuilder } from "@api/lib/note";
import NoteBlocContainer from "./NoteBlocContainer";
import NoteContentElement from "./NoteContentElement";
import { LanguageCode } from "@/utils/locale";


export default function NotePage({ note, locale }: {
	locale: LanguageCode, note: ReturnType<NoteBuilder["serialize"]>

}) {
	return <div className="w-full justify-center">
		<h1>{note.name}</h1>
		<div className="flex items-center justify-center gap-10 flex-wrap">
			{note.content
				.map((bloc, i) => <NoteBlocContainer
					key={i}
					title={bloc.names?.[locale]}>
					<NoteContentElement {...{ bloc, locale }} />
				</NoteBlocContainer>)}
		</div>
	</div>
}