"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, ReactNode, useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import useSound from 'use-sound';

type EasterEggState = "unactive" | "active" | "activated";

export default function HomePage() {
  const t = useTranslations('HomePage');
  const [easterEggState, setEasterEggState] = useState<EasterEggState>('unactive');

  return <>
    <div className="relative text-4xl w-full h-full flex flex-col items-center justify-center gap-4">

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
        [
          <span >{t('source_code_on')}</span>,
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
        ]
      ].map((lineGroup, i) => (
        <div key={i} className="inline-flex gap-2 items-center justify-center *:items-center flex-wrap">
          {lineGroup.map((elem, j) => <Fragment key={j}>{elem}</Fragment>)}
        </div>
      ))}
    </div>

    {/* When active, show the black overlay with "ok" */}
    {easterEggState === "active" && (
      <>
        <BlackOverlay setEasterEggState={setEasterEggState} />
        <AchievementAnimation />
      </>
    )}
  </>
}

function HeartEasterEgg({ heartAlt, easterEggState, setEasterEggState }: {
  heartAlt: string;
  easterEggState: EasterEggState;
  setEasterEggState: Dispatch<SetStateAction<EasterEggState>>;
}) {
  const [clickCount, setClickCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const [playMcSound] = useSound('/audios/rare_achievement.mp3');

  // Gestion des clics
  const handleHeartClick = () => {
    // if (easterEggState !== 'unactive') return;

    // if (clickTimeout.current) clearTimeout(clickTimeout.current);

    //   setClickCount(prev => {
    //     const newCount = prev + 1;
    //     if (newCount >= 5) {
    //       setTriggered(true); // DÉCLENCHE L'ANIMATION PLUS TARD
    //     }

    //     clickTimeout.current = setTimeout(() => setClickCount(0), 2000);
    //     return newCount;
    //   });
  };

  // Lancer l'easter egg si triggered
  // useEffect(() => {
  //   if (triggered && easterEggState === 'unactive') {
  //     setEasterEggState('active');
  //     playMcSound();

  //     const timeout = setTimeout(() => {
  //       setEasterEggState('activated');
  //       setTriggered(false);
  //     }, 3000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [triggered, easterEggState, setEasterEggState, playMcSound]);

  return (
    <Image
      src="/svgs/heart.svg"
      width={30}
      height={30}
      alt={heartAlt}
      className={`inline-flex aspect-square cursor-pointer hover:scale-110 duration-150
        ${easterEggState === "active" ? "animate-pulse" : ""}`}
      onClick={handleHeartClick}
    />
  );
}

function BlackOverlay({ setEasterEggState }: { setEasterEggState: Dispatch<SetStateAction<EasterEggState>> }) {
  return (
    <div
      className="absolute top-0 left-0 backdrop-blur-xs w-screen h-screen bg-black z-40 flex items-center justify-center p-2 object-contain "
      onClick={() => setEasterEggState("activated")}
    >
      <Image src="/media/easteregg.png" alt="" width="600" height="800" className='' />
    </div>
  );
}

function AchievementAnimation() {
  // This component shows an image that animates up and then back down over 2 seconds.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    // After 2 seconds, toggle the animation class to move it back down.
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-0 right-0 z-50 transition-transform duration-700
        ${visible ? "" : "translate-y-20"}`}
    >
      <div className="relative">
        <Image
          src="https://skinmc.net/achievement/11/Too+curious/Discover+my+easter+egg"
          width={300}
          height={300}
          alt="Achievement unlocked!"
          unoptimized
          className="opacity-100"
        />
      </div>
    </div>
  );
}

function Mention({ icon, name, href, background, padding }: {
  icon: string;
  name: string;
  href?: string;
  background?: boolean;
  padding?: boolean;
}) {
  return (
    <Link
      {...(href ? { href, target: '_blank' } : { href: '' })}
      className="inline-flex gap-2 items-center justify-evenly p-1 px-2 rounded-2xl transition-all bg-neutral-700/70 hover:bg-neutral-700 shadow-black/20 shadow-lg select-allcursor-pointer hover:scale-102 hover:rotate-x-1 hover:-rotate-z-1 group"
    >
      <Image
        src={icon}
        width={70}
        height={70}
        alt={name}
        className={`h-8 w-fit aspect-square rounded-full select-none group-hover:scale-105 duration-150 ${background ? "bg-black" : ""} ${padding ? "p-1" : ""}`}
      />
      <span className="group-hover:font-bold transition-all">{name}</span>
      {href && (
        <Image
          src="/svgs/open_in_view.svg"
          width={50}
          height={50}
          alt=""
          className="w-0 group-hover:w-4 transition-all duration-300 h-4 aspect-square self-baseline -ml-1"
        />
      )}
    </Link>
  );
}
