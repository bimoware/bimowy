import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Exercising...',
  icons: '/svgs/exercise.svg'
}

export default function Layout({ children }: { children: ReactNode }) { return children }
