import { Language, LocaleString, LocaleStringRecord } from "../../main"

type CheatSheetConfig = {
	beta: boolean
	id: string
	todo: LocaleStringRecord[]
	nameLocalizations: LocaleStringRecord
	descLocalizations?: LocaleStringRecord
	content: CheatSheetContent
}

export class CheatSheetBuilder {
	public rawData: CheatSheetConfig = {
		beta: false,
		todo: [],
		id: "",
		nameLocalizations: {
			fr: "",
			en: ""
		},
		content: []
	}
	constructor(public id: CheatSheetConfig["id"]) {
		this.rawData.id = id
	}
	setBeta(isBeta: CheatSheetConfig["beta"]) {
		this.rawData.beta = isBeta
		return this
	}
	serialize(lang: Language) {
		const { nameLocalizations, descLocalizations } =
			this.rawData
		return {
			...this.rawData,
			name: nameLocalizations[lang],
			desc: descLocalizations?.[lang]
		}
	}
	setName(names: string | CheatSheetConfig["nameLocalizations"]) {
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
	setDesc(descs: string | CheatSheetConfig["descLocalizations"]) {
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
	setContent(content: CheatSheetConfig["content"]) {
		this.rawData.content = content
		return this
	}
	setTodo(todos: CheatSheetConfig["todo"]) {
		this.rawData.todo = todos
		return this
	}
}

export type CheatSheetContent = CheatSheetBloc[]
export type CheatSheetWidgetID = "TrigonometricCircle" | "TrigonometricTable"

export type CheatSheetBloc =
	{
		title?: LocaleStringRecord
	} & (
		{
			type: "text"
			texts: string[]
		}
		| {
			type: "widget",
			id: CheatSheetWidgetID
		}
	)
