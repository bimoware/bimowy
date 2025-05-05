import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Sandbox',
  icons: '/svgs/sandbox.svg'
}

export default function Layout({
  children
}: {
  children: ReactNode
}) {
  return children
}
