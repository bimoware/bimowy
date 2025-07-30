"use client"

import { useTranslations } from "next-intl"

export default function HomePage() {
	const t = useTranslations("HomePage")
	const title = t('Welcome')
	return <>
		<Title {...{ title }} />
	</>
}
function Title({ title }: {title: string }) {
	return <div className="text-6xl text-center font-bold 
	flex flex-col sm:flex-row
	gap-4
	my-4
	h-fit
	select-none">
		{title}
	</div>
}