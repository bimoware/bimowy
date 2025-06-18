import { getTranslations } from "next-intl/server"

export default async function HomePage() {
	const t = await getTranslations('HomePage')
	return <div className="flex h-full w-full items-center justify-center">
		<h1>{t('title')}</h1>
	</div>
}