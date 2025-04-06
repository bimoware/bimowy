import { ReactNode } from 'react'
export function Bloc({
  type,
  children
}: {
  type: 'sidebar' | 'full-body'
  children: ReactNode
}) {
  const styles = {
    'sidebar': 'p-2 flex flex-col w-18 shrink-0 h-fit',
    'full-body': 'p-7 w-full'
  }
  return (
    <div
      className={`bg-neutral-900 m-4 rounded-3xl overflow-y-scroll items-center ${styles[type]}`}
    >
      {children}
    </div>
  )
}
