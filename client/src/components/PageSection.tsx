interface PageSectionProps {
  children: React.ReactNode
  className?: string
}

export default function PageSection({ children, className }: PageSectionProps) {
  return <div className={`h-full bg-white/2 rounded-2xl p-3 ${className}`}>{children}</div>
}
