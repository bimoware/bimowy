import { Language, LocaleString, LocaleStringRecord } from "../defs"

type CheatSheetConfig = {
	beta: boolean
	id: string
	nameLocalizations: LocaleStringRecord
	descLocalizations?: LocaleStringRecord
	content: CheatSheetContent
	tags: string[]
}

export class CheatSheetBuilder {
	public rawData: CheatSheetConfig = {
		beta: false,
		id: "",
		nameLocalizations: {
			fr: "",
			en: ""
		},
		content: [],
		tags: []
	}
	constructor(public id: string) {
		this.rawData.id = id
	}
	setBeta(isBeta: boolean) {
		this.rawData.beta = isBeta
		return this
	}
	serialize(lang: Language) {
		const { id, beta, tags, content, nameLocalizations, descLocalizations } =
			this.rawData
		return {
			id,
			beta,
			tags,
			content,
			name: nameLocalizations[lang],
			desc: descLocalizations?.[lang] ?? null
		}
	}
	setTags(tags: string[]) {
		this.rawData.tags = tags
		return this
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

export type CheatSheetBloc =
	| {
		type: "bloc"
		content: CheatSheetContent
	}
	| {
		type: "text"
		text: string
	}
	| {
		type: "image"
		href: string
	}
