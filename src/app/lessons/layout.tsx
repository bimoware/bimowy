import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Lessons',
	icons: '/svgs/lesson.svg'
}

export default function Layout({ children }: { children: ReactNode }) { return children }
