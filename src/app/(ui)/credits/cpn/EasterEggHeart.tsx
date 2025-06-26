"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import useSound from "use-sound";
import { Mention } from "./Mention";
import { GroupLine } from "./GroupLine";

export function EasterEggHeart() {
	const t = useTranslations('CreditsPage');
	const [easterEggEnabled, setEasterEggEnabled] = useState(false);
	const [play] = useSound('/audios/yahaha.mp3')

	return [
		<>
			<span>{t('made_with')}</span>
			<Image
				src="/svgs/heart.svg"
				width={30}
				height={30}
				alt={"🫠"}
				className={`inline-flex aspect-square duration-150 py-0.5 sm:py-0
        ${!easterEggEnabled ? "cursor-pointer hover:scale-110" : "hover:scale-95"}`}
				onClick={() => {
					if (!easterEggEnabled) {
						setEasterEggEnabled(true)
						play()
					}
				}}
			/>
			<span>{t('by')}</span>
			<Mention icon="/media/pfp.jpeg" name="bimoware" href="https://github.com/bimoware" />
		</>,
		...(!easterEggEnabled ? [] :
			[
				<span>{t('sorry_easter_egg')}</span>,
				<video width="238" height="512" autoPlay preload="none" loop>
					<source src="/media/blackbabydance.mp4" type="video/mp4" />
					<span>{t('no_javascript')}</span>
				</video>
			]
		)
	].map((group, i) => <GroupLine key={"easteregg-" + i}> {group}</GroupLine>)
}