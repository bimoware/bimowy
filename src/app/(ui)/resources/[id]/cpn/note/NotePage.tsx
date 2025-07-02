import { NoteBuilder } from "@/lib/resources";
import NoteBlocContainer from "./NoteBlocContainer";
import NoteContentElement from "./NoteContentElement";
import { LanguageCode } from "@/lib/locale";


export default function NotePage({ name, content, locale }: ReturnType<NoteBuilder["serialize"]> & {
	locale: LanguageCode
}) {
	return <div className="w-full justify-center">
		<h1>{name}</h1>
		<div className="flex items-center justify-center gap-10 flex-wrap">
			{content
				.map((bloc, i) => <NoteBlocContainer
					key={i}
					title={bloc.names?.[locale]}>
					<NoteContentElement {...{ bloc, locale }} />
				</NoteBlocContainer>)}
		</div>
	</div>
}