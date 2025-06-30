import { generateMetadataUtil } from '@cpn/sidebars/main'
import { useTranslations } from 'next-intl'

export async function generateMetadata() {
  return await generateMetadataUtil('page-not-found')
}

export default function NotFound() {
  const t = useTranslations('404')
  return (
    <div className='w-full h-full flex flex-col items-center justify-center animate-appear'>
      <h1>{t('PageNotFound')} (404)</h1>
      <p>
        {t('PageNotFoundDesc')} 😔..
      </p>
    </div>
  )
}
