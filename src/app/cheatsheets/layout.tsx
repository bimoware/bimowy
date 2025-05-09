import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Cheat sheets',
	icons: '/svgs/cheatsheet.svg'
}

export default function Layout({
	children
}: {
	children: ReactNode
}) {
	return children
}
