import { NoteBloc } from "@/lib/resources";
import { LanguageCode } from "@/lib/locale";
import Latex from "react-latex-next";
import { Widget } from "@cpn/Widget";

export default async function NoteContentElement({ bloc }: {
	bloc: NoteBloc,
	locale: LanguageCode
}) {
	switch (bloc.type) {
		case 'text':
			return bloc.texts.map((t, i) => <Latex key={i}>{t}</Latex>)
		case 'widget':
			return <Widget id={bloc.id} props={{}} />
		default:
			return null;
	}
}