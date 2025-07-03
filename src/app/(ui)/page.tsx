"use client"

import { useAuthStateChange, useAuthUser, UserMetadata } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"

export default function HomePage() {
	const t = useTranslations("HomePage")
	const title = t('Welcome')
	const hiddenRealNameText = t('or_maybe')
	const [user, setUser] = useAuthUser()
	useAuthStateChange(setUser)
	return <>
		<Title {...{ user, title, hiddenRealNameText }} />
	</>
}
function Title({ user, title, hiddenRealNameText }: { title: string, hiddenRealNameText: string, user?: User }) {
	return <div className="text-6xl text-center font-bold 
	flex flex-col sm:flex-row
	gap-4
	my-4
	h-fit
	select-none">
		{title},
		<div className="relative">
			<Name {...{ user, hiddenRealNameText }} />
		</div>
	</div>
}

function Name({ user, hiddenRealNameText }: { hiddenRealNameText: string, user?: User }) {
	if (!user) return <>!</>
	const data = user.user_metadata as UserMetadata
	return <div className="h-fit">
		<span className="peer">{data.user_name}</span>
		{
			data.full_name && <span className="absolute top-16 right-2
			font-light
			-rotate-1
			text-2xl
			duration-150
			opacity-0 peer-hover:opacity-25
			peer-hover:translate-y-1">
				{hiddenRealNameText} {data.full_name} 👁️👁️
			</span>}

	</div>
}