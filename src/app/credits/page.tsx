"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState, Dispatch, SetStateAction, useEffect } from 'react';
import useSound from 'use-sound';

export default function CreditsPage() {
  const t = useTranslations('CreditsPage');
  const [easterEggEnabled, setEasterEggEnabled] = useState(false);
  const [play] = useSound('/audios/yahaha.mp3')

  useEffect(() => {
    if (easterEggEnabled) play()
  }, [easterEggEnabled])
  return <div className="relative text-4xl w-full h-full flex flex-col items-center justify-center gap-4">
    {[
      [
        <span>{t('made_with')}</span>,
        <HeartEasterEgg
          heartAlt={t('heart')}
          easterEggEnabled={easterEggEnabled}
          setEasterEggEnabled={setEasterEggEnabled}
        />,
        <span>{t('by')}</span>,
        <Mention icon="/media/pfp.jpeg" name="bimoware" href="https://github.com/bimoware" />
      ],
      ...(!easterEggEnabled ? [] :
        [[
          <span>{t('honorable_mention')}</span>,
          <Mention icon="/media/moha.jpg" name="Moha" href="https://www.instagram.com/mohaa.ghrb/" ultra />,
        ]]
      ),
      [
        <span>{t('source_code_on')}</span>,
        <Mention icon="/svgs/github.svg" background name="bimoware/bimowy" href="https://github.com/bimoware/bimowy/" />
      ],
      [
        <span>{t('inspired')}</span>,
        <Mention icon="/svgs/khan-academy.svg" name="Khan Academy" href="https://www.khanacademy.org/" />
      ],
      [
        <span>{t('frameworks')}</span>,
        <Mention icon="/svgs/nextjs.svg" name="Next.Js" href="https://nextjs.org/" />,
        <span>&</span>,
        <Mention
          icon="/svgs/tailwind.svg"
          background
          padding
          name="TailwindCSS"
          href="https://tailwindcss.com/docs/installation/framework-guides/nextjs/"
        />
      ],
      [
        <span>{t('available_in')}</span>,
        <Mention icon="/svgs/globe.svg" name="Next-intl" href="https://next-intl.dev/" />
      ],
      [
        <span>{t('you_like')}</span>,
        <Mention icon='/svgs/star.svg' name="Ctrl + D" />
      ],
    ].map((lineGroup, i) => {
      if (!lineGroup.length) return;
      return <div key={i}
        className="inline-flex gap-2 items-center justify-center *:items-center flex-wrap">
        {lineGroup.map((elem, j) => <Fragment key={j}>{elem}</Fragment>)}
      </div>
    })
    }
  </div >
}

function HeartEasterEgg({ heartAlt, easterEggEnabled, setEasterEggEnabled }: {
  heartAlt: string;
  easterEggEnabled: boolean;
  setEasterEggEnabled: Dispatch<SetStateAction<boolean>>
}) {

  const handleHeartClick = () => {
    if (!easterEggEnabled) return setEasterEggEnabled(true)
  }

  return (
    <Image
      src="/svgs/heart.svg"
      width={30}
      height={30}
      alt={heartAlt}
      className={`inline-flex aspect-square  duration-150
        ${!easterEggEnabled ? "cursor-pointer hover:scale-110" : "hover:scale-95"}`}
      onClick={handleHeartClick}
    />
  );
}

function Mention({ icon, name, hoverName, href, background, padding, ultra }: {
  icon: string;
  name: string;
  hoverName?: string;
  href?: string;
  background?: boolean;
  padding?: boolean;
  ultra?: boolean;
}) {
  return (
    <Link
      {...(href ? { href, target: '_blank' } : { href: '' })}
      className={`inline-flex gap-2 items-center justify-evenly
      p-1 px-2
      rounded-2xl
      transition-all
      shadow-black/20 shadow-lg
      select-all cursor-pointer
      hover:scale-102 hover:rotate-x-1 hover:-rotate-z-1
      group
      duration-150
      ${ultra
          ? `bg-indigo-800 hover:bg-indigo-800/80
          hover:gap-3
          hover:-translate-y-2
          hover:grayscale-[10%]`
          : "bg-neutral-700/70 hover:bg-white/10"}`}
    >
      <Image
        src={icon}
        width={70}
        height={70}
        alt={name}
        className={`h-8 w-fit
          aspect-square
          rounded-full
          select-none
          group-hover:scale-105 duration-150
          ${background && "bg-black"}
          ${padding && "p-1"}
          ${ultra && "group-hover:scale-125"}`}
      />
      <span key="main" className={`group-hover:font-bold transition-all`}>
        {name}
      </span>
      {href && (
        <Image
          src="/svgs/open_in_view.svg"
          width={50}
          height={50}
          alt="Open"
          className={`w-0 h-4 -ml-1
          group-hover:w-4
          transition-all duration-300
          aspect-square self-baseline`}
        />
      )
      }
    </Link >
  );
}