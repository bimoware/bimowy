import { Metadata } from 'next'
import { useTranslations } from 'next-intl'

export const metadata: Metadata = {
  title: 'Page not found',
  icons: '/svgs/report.svg'
}

export default function NotFound() {
  const t = useTranslations('404')
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <h1>{t('PageNotFound')} (404)</h1>
      <p>
        {t('PageNotFoundDesc')} 😔..
      </p>
    </div>
  )
}
