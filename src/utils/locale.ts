import { useLocale } from "next-intl"
import { getLocale } from "next-intl/server"

export const LANGUAGE_CODES = ["fr", "en"] as const
export type LanguageCode = (typeof LANGUAGE_CODES)[number]
export type LocaleRecord = {
	[K in LanguageCode]: string
}
export type LocaleString =
	| string
	| LocaleRecord

export function toLocaleString(text: LocaleString) {
	return typeof text === "string"
		? { en: text, fr: text }
		: text
}

export function isValidLang(lang: string) {
	return lang == "fr" || lang == "en"
}

export async function getLanguage() {
	return (await getLocale()) as LanguageCode
}

export function useLanguage() {
	return useLocale() as LanguageCode
}