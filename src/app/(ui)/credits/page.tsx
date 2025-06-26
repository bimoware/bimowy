import { getTranslations } from 'next-intl/server';
import { Mention } from './cpn/Mention';
import { GroupLine } from './cpn/GroupLine';
import { EasterEggHeart } from './cpn/EasterEggHeart';
import { generateMetadataUtil } from '@/utils/sidebar';

export async function generateMetadata() {
  return await generateMetadataUtil('credits')
}


export default async function CreditsPage() {
  const t = await getTranslations('CreditsPage');
  return <div className='w-full'>
    <h1>{t('title')}</h1>
    <div className="relative text-2xl md:text-4xl w-full h-full flex flex-col  gap-4">
      <EasterEggHeart />
      {[
        <>
          <span>{t('source_code_on')}</span>
          <Mention icon="/svgs/github.svg" background name="bimoware/bimowy-api" href="https://github.com/bimoware/bimowy-api" />
        </>,
        <>
          <span>{t('inspired')}</span>
          <Mention icon="/svgs/khan-academy.svg" name="Khan Academy" notrounded href="https://www.khanacademy.org/" />
        </>,
        <>
          <span>{t('available_in')}</span>
          <Mention icon="/svgs/globe.svg" name="Next-intl" href="https://next-intl.dev/" />
        </>,
        <>
          <span>{t('frameworks')}</span>
          <Mention
            icon="/svgs/vscode.svg"
            notrounded
            name="Visual Studio Code"
            href="https://code.visualstudio.com/"
          />
        </>,
        <>
          <span>{t('deployed_on')}</span>
          <Mention icon="/svgs/vercel.svg" name="Vercel" notrounded href="https://vercel.com/" />
        </>,
        <>
          <span>{t('domain_from')}</span>
          <Mention icon="/svgs/namecheap.svg" name="Namecheap" href="https://namecheap.com/" />
          <span>( ~ {t('domain_price')})</span>
        </>,
        <>
          <span>{t('frameworks')}</span>
          <Mention icon="/svgs/nextjs.svg" name="Next.Js" href="https://nextjs.org/" />
          <span>&</span>
          <Mention
            icon="/svgs/tailwind.svg"
            name="TailwindCSS"
            href="https://tailwindcss.com/docs/installation/framework-guides/nextjs/"
          />
        </>,
        <>
          <span>{t('you_like')}</span>
          <Mention icon='/svgs/star.svg' name="Ctrl + D" notrounded />
        </>,
      ]
        .map((group, i) => <GroupLine key={"normal-" + i}>{group}</GroupLine>)
      }
    </div>
  </div>
}





