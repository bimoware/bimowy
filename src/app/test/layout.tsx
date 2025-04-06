import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'Test',
    template: '%s | Bimowy'
  },
  description: 'Test Page',
  icons: '/svgs/test.svg'
}

export default function Layout({
  children
}: {
  children: ReactNode
}) {
  return children
}
