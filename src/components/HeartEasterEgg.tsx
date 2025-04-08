"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import useSound from "use-sound";

type EasterEggState = 'inactive' | 'activating' | 'active' | 'hiding' | 'completed';

export default function HeartEasterEgg({ heartAlt }: { heartAlt: string }) {
  const [clickCount, setClickCount] = useState(0);
  const [easterEggState, setEasterEggState] = useState<EasterEggState>('inactive');
  const [playMcSound, { sound }] = useSound('/audios/rare_achievement.mp3');
  const clickTimeout = useRef<NodeJS.Timeout>(null);
  const advancementRef = useRef<HTMLDivElement>(null);

  // Click handler with cooldown and explosion-safe checks
  const handleHeartClick = () => {
    if (easterEggState !== 'inactive') return;

    if (clickTimeout.current) clearTimeout(clickTimeout.current);

    setClickCount(prev => {
      const newCount = prev + 1;

      clickTimeout.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);

      if (newCount === 5) {
        setEasterEggState('activating');
      }
      return newCount;
    });
  };

  // Animation lifecycle manager
  useEffect(() => {
    if (easterEggState !== 'activating') return;

    const audioDuration = sound?.duration() ?? 3000;

    // Phase 1: Activate overlay and prepare advancement
    setEasterEggState('active');

    // Phase 2: Start hiding 500ms before audio ends
    const hideTimeout = setTimeout(() => {
      setEasterEggState('hiding');
    }, audioDuration - 500);

    // Phase 3: Complete after hide animation
    const completionTimeout = setTimeout(() => {
      setEasterEggState('completed');
    }, audioDuration);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(completionTimeout);
    };
  }, [easterEggState, sound]);

  // Sound trigger with safety checks
  useEffect(() => {
    if (easterEggState === 'active') {
      playMcSound();
    }
  }, [easterEggState, playMcSound]);

  return (
    <>
      <Image
        src="/svgs/heart.svg"
        width={30}
        height={30}
        alt={heartAlt}
        className={`aspect-square cursor-pointer hover:scale-110 duration-150 ${easterEggState === 'activating' ? 'animate-pulse' : ''
          }`}
        onClick={handleHeartClick}
      />

      {/* Dark Overlay */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-40 transition-opacity duration-300 ${easterEggState === 'active' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setEasterEggState('completed')}
      />

      {/* Achievement Container */}
      <div
        ref={advancementRef}
        className={`fixed bottom-4 right-4 z-50 transition-transform duration-500 ease-out ${easterEggState === 'active'
            ? 'translate-y-0'
            : 'translate-y-full'
          }`}
      >
        <div className="relative mb-4 animate-float">
          <Image
            src="https://skinmc.net/achievement/9/Too+curious/Discover+my+easter+egg"
            width={350}
            height={350}
            alt="Achievement unlocked!"
            unoptimized
            className="opacity-1 transition-opacity duration-300"
            onLoadingComplete={(img) => {
              img.style.opacity = '1';
            }}
          />
        </div>
      </div>
    </>
  );
}