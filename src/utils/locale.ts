export const LANGUAGE_CODES = ["fr", "en"] as const
export type LanguageCode = (typeof LANGUAGE_CODES)[number]
export type LocaleStringRecord = {
	[K in LanguageCode]: string
}
export type LocaleString =
	| string
	| LocaleStringRecord

export function toLocaleString(localeString: LocaleString) {
	return typeof localeString === "string"
		? { en: localeString, fr: localeString }
		: localeString
}