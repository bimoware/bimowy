import { Bloc } from '@cpn/Bloc'
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <Bloc type='full-body'>
      <h1>Bimowy</h1>
      <p>{t('subtitle')}</p>
    </Bloc>
  )
}
