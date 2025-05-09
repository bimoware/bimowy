export const LanguageCodes = ["fr", "en"] as const
export type Language = (typeof LanguageCodes)[number]
export type LocaleStringRecord = {
	[K in Language]: string
}

export type LocaleString =
	| string
	| {
			[K in Language]: string
	  }
