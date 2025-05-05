import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Test',
  icons: '/svgs/test.svg'
}

export default function Layout({
  children
}: {
  children: ReactNode
}) {
  return children
}
