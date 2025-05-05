import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Favorites',
	icons: '/svgs/bookmark.svg'
}

export default function Layout({ children }: { children: ReactNode }) {
	return children
}