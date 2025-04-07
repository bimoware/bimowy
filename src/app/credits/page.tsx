import { getTranslations } from 'next-intl/server';
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react';


export default async function CreditsPage() {
  const t = await getTranslations('CreditsPage');
  return (
    <div className='text-4xl w-full h-full items-center justify-center gap-4 flex flex-col'>
      {
        [
          [
            <span>{t('made_with')}</span>,
            <Image
              src={'/svgs/heart.svg'}
              width={30}
              height={30}
              alt={t('heart')}
              className='aspect-square'
            />,
            <span>{t('by')}</span>,
            <Mention
              icon={'/media/pfp.jpeg'}
              name='bimoware'
              href={'https://github.com/bimoware'}
            />
          ],
          [
            <span>{t('source_code_on')}</span>,
            <Mention
              icon={'/svgs/github.svg'}
              background
              name='bimoware/bimowy'
              href={'https://github.com/bimoware/bimowy/'}
            />
          ],
          [
            <span>{t('inspired')}</span>,
            <Mention
              icon={'/svgs/khan-academy.svg'}
              name='Khan Academy'
              href={'https://www.khanacademy.org/'}
            />
          ],
          [
            <span>{t('frameworks')}</span>,
            <Mention
              icon={'/svgs/nextjs.svg'}
              name='Next.Js'
              href={'https://nextjs.org/'}
            />,
            <span>&</span>,
            <Mention
              icon={'/svgs/tailwind.svg'}
              background
              padding
              name='TailwindCSS'
              href={
                'https://tailwindcss.com/docs/installation/framework-guides/nextjs/'
              }
            />
          ],
          [
            <span>{t('available_in')}</span>,
            <Mention
              icon={'/svgs/globe.svg'}
              name='Next-intl'
              href='https://next-intl.dev/'
            />,

          ]
        ].map((lineGroup, i) => <div key={i} className='inline-flex gap-2 items-center justify-center'>
          {lineGroup.map((elem, i) => <Fragment key={i}>{elem}</Fragment>)}
        </div>)
      }
    </div>
  )
}

function Mention({
  icon,
  name,
  href,
  background,
  padding
}: {
  icon: string
  name: string
  href?: string
  background?: boolean
  padding?: boolean
}) {
  return (
    <Link
      {...(href
        ? { href, target: '_blank' }
        : { href: '' })}
      className='inline-flex gap-2 hover:gap-3 items-center justify-evenly p-1 px-2 rounded-2xl
        transition-all
        bg-neutral-700/70 hover:bg-neutral-700
        shadow-black/20 shadow-lg
        select-allcursor-pointer hover:scale-102 hover:rotate-x-1 hover:-rotate-z-1
        group'
    >
      <Image
        src={icon}
        width={70}
        height={70}
        alt={name}
        className={`h-8 w-fit aspect-square rounded-full select-none
          group-hover:scale-125 group-hover:-translate-y-0.5 group-hover:rotate-3 duration-150
                ${background && 'bg-black'} ${padding && 'p-1'}`}
      />
      <span className='group-hover:font-bold transition-all'>{name}</span>
      {href && (
        <Image
          src={'/svgs/open_in_view.svg'}
          width={50}
          height={50}
          alt={""}
          className='w-0 group-hover:w-4 transition-all duration-300
                 h-4 aspect-square self-baseline -ml-1'
        />
      )}
    </Link>
  )
}
