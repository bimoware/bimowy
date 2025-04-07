'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function CreditsPage() {
  return (
    <div className='text-4xl w-full h-full items-center justify-center gap-2 flex flex-col'>
      <div className='inline-flex gap-2 items-center justify-center'>
        <span>Made with</span>
        <Image
          src={'/svgs/heart.svg'}
          width={30}
          height={30}
          alt='Heart'
          className='aspect-square'
        />
        <span>by</span>
        <Mention
          icon={'/media/pfp.jpeg'}
          name='bimoware'
          href={'https://github.com/bimoware'}
        />
      </div>
      <div className='inline-flex gap-2 items-center justify-center'>
        <span>Source code on </span>
        <Mention
          icon={'/svgs/github.svg'}
          background
          name='bimoware/bimowy'
          href={'https://github.com/bimoware/bimowy/'}
        />
      </div>
      <div className='inline-flex gap-2 items-center justify-center'>
        <span>Inspired by</span>
        <Mention
          icon={'/svgs/khan-academy.svg'}
          name='Khan Academy'
          href={'https://www.khanacademy.org/'}
        />
      </div>
      <div className='inline-flex gap-2 items-center justify-center'>
        <span>Frameworks used are</span>
        <Mention
          icon={'/svgs/nextjs.svg'}
          name='Next.Js'
          href={'https://nextjs.org/'}
        />
        <span>and</span>
        <Mention
          icon={'/svgs/tailwind.svg'}
          background
          padding
          name='TailwindCSS'
          href={
            'https://tailwindcss.com/docs/installation/framework-guides/nextjs/'
          }
        />
      </div>
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
    >
      <div
        className='inline-flex gap-2 items-center p-1 px-2 rounded-2xl
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
          className={`h-8 w-fit aspect-square rounded-full
                ${background && 'bg-black'} ${padding && 'p-1'}`}
        />
        <span className='group-hover:font-bold transition-all'>{name}</span>
        {href && (
          <Image
            src={'/svgs/open_in_view.svg'}
            width={50}
            height={50}
            alt='Open in new tab'
            className='w-0 group-hover:w-4 transition-all duration-300
                 h-4 aspect-square self-baseline -ml-1'
          />
        )}
      </div>
    </Link>
  )
}
