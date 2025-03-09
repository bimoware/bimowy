import { ReactNode } from 'react'

export default function ConditionalHref({
  href,
  children,
}: {
  href?: string
  children: ReactNode
}) {
  return !href ? children : <a href={href}>{children}</a>
}
