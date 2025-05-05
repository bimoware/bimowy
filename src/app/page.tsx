"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { AnimatePresence, motion } from "motion/react"
import useSound from 'use-sound';

type EasterEggState = "not-yet" | "active" | "never-again"
export default function HomePage() {
  const t = useTranslations('HomePage');
  const [easterEggState, setEasterEggState] = useState<EasterEggState>("not-yet");
  const [play] = useSound('/audios/yahaha.mp3')

  useEffect(() => {
    if (easterEggState == "active") play()
  }, [easterEggState])
  return <div className="relative text-4xl w-full h-full flex flex-col items-center justify-center gap-4">
    <AnimatePresence>
      {[
        [
          <span>{t('made_with')}</span>,
          <HeartEasterEgg
            heartAlt={t('heart')}
            easterEggState={easterEggState}
            setEasterEggState={setEasterEggState}
          />,
          <span>{t('by')}</span>,
          <Mention icon="/media/pfp.jpeg" name="bimoware" href="https://github.com/bimoware" />
        ],
        ...(easterEggState !== "active" ? [[]] : [
          [
            <span>{t('honorable_mention')}</span>,
            <Mention icon="/media/moha.jpg" name="Moha" hoverName="Mohammed Gharbi" href="https://www.instagram.com/mohaa.ghrb/" ultra />
          ]
        ]),
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
          <Mention icon='/svgs/star.svg' name={t('star')} />
        ],
      ].map((lineGroup, i) => {
        if (!lineGroup.length) return;
        return <motion.div key={i}
          className="inline-flex gap-2 items-center justify-center *:items-center flex-wrap"
          // Fade in when the element enters the viewport:
          initial={{ opacity: 0, scale: 0.2, fontSize: 0 }}
          animate={{ opacity: 1, scale: 1, fontSize: "1em" }}
          exit={{ opacity: 0, scale: 0.2, fontSize: 0 }}>
          {lineGroup.map((elem, j) => <Fragment key={j}>{elem}</Fragment>)}
        </motion.div>
      })
      }
    </AnimatePresence>
  </div>
}

function HeartEasterEgg({ heartAlt, easterEggState, setEasterEggState }: {
  heartAlt: string;
  easterEggState: EasterEggState;
  setEasterEggState: Dispatch<SetStateAction<EasterEggState>>
}) {
  const [clickCount, setClickCount] = useState(0);

  const handleHeartClick = () => {
    if (easterEggState === "never-again") return;
    if (easterEggState == "active") return setEasterEggState('never-again')
    if (clickCount < 10) return setClickCount(prev => prev + 1)
    return setEasterEggState("active")
  }

  return (
    <Image
      src="/svgs/heart.svg"
      width={30}
      height={30}
      alt={heartAlt}
      className={`inline-flex aspect-square hover:scale-110 duration-150
        ${easterEggState === "active" && "animate-bounce"}
        ${easterEggState !== "never-again" && "cursor-pointer"}`}
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
      ${ultra
          ? `bg-rose-500 hover:bg-rose-500/80
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
      <span key="main" className={`group-hover:font-bold transition-all ${hoverName && "inline group-hover:hidden"}`}>{name}</span>
      {hoverName && <span key="notmain" className='group-hover:font-bold transition-all hidden group-hover:inline'>{hoverName}</span>}
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
      )}
    </Link>
  );
}