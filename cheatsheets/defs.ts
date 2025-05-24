import { Language, LocaleString, LocaleStringRecord } from "../defs"

type CheatSheetConfig = {
	beta: boolean
	id: string
	nameLocalizations: LocaleStringRecord
	descLocalizations?: LocaleStringRecord
	content: CheatSheetContent
}

export class CheatSheetBuilder {
	public rawData: CheatSheetConfig = {
		beta: false,
		id: "",
		nameLocalizations: {
			fr: "",
			en: ""
		},
		content: []
	}
	constructor(public id: string) {
		this.rawData.id = id
	}
	setBeta(isBeta: boolean) {
		this.rawData.beta = isBeta
		return this
	}
	serialize(lang: Language) {
		const { id, beta, content, nameLocalizations, descLocalizations } =
			this.rawData
		return {
			id,
			beta,
			content,
			name: nameLocalizations[lang],
			desc: descLocalizations?.[lang]
		}
	}
	setName(names: LocaleString) {
		if (typeof names == "string") {
			this.rawData.nameLocalizations = {
				fr: names,
				en: names
			}
		} else {
			this.rawData.nameLocalizations = names
		}
		return this
	}
	setDesc(descs: LocaleString) {
		if (typeof descs == "string") {
			this.rawData.descLocalizations = {
				fr: descs,
				en: descs
			}
		} else {
			this.rawData.descLocalizations = descs
		}
		return this
	}
	setContent(content: CheatSheetContent) {
		this.rawData.content = content
		return this
	}
}

export type CheatSheetContent = CheatSheetBloc[]
export type CheatSheetWidgetID = "TrigonometricCircle" | "TrigonometricTable"

export type CheatSheetBloc =
	{
		title?: string
	} & (
		{
			type: "text"
			text: string
		}
		| {
			type: "widget",
			id: CheatSheetWidgetID
		}
	)
