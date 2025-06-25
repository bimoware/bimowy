import { NoteBloc } from "@api/lib/note";
import { LanguageCode } from "@/utils/locale";
import Widgets from "@/utils/widgets";
import Latex from "react-latex-next";

export default async function NoteContentElement({ bloc, locale }: {
	bloc: NoteBloc,
	locale: LanguageCode
}) {
	switch (bloc.type) {
		case 'text':
			return bloc.texts.map((t, i) => <Latex key={i}>{t}</Latex>)
		case 'widget':
			bloc.id
			const Widget = Widgets[bloc.id]
			return <Widget {...{ locale }} />
		default:
			return null;
	}
}