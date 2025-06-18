import { CheatSheetBloc } from "@api/ressources/cheatsheets/defs";
import { Language } from "@api/main";
import TrigonometricCircle from "@/cpn/widgets/TrigonometricCircle";
import TrigonometricTable from "@/cpn/widgets/TrigonometricTable";
import Latex from "react-latex-next";

export async function CheatSheetContentElement({ bloc, locale }: { bloc: CheatSheetBloc, locale: Language }) {
	switch (bloc.type) {
		case 'text':
			return bloc.texts.map((t, i) => <Latex key={i}>{t}</Latex>)
		case 'widget':
			return {
				"TrigonometricCircle": <TrigonometricCircle />,
				"TrigonometricTable": <TrigonometricTable {...{ locale }} />
			}[bloc.id]
		default:
			return null;
	}
}