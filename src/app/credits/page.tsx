"use client";

import Image from "next/image";
import Link from "next/link";

export default function CreditsPage() {
    return <div className="text-2xl w-full h-full items-center justify-center gap-2 flex flex-col">
        <div className="flex gap-2 items-center justify-center">
            <span>Made with</span>
            <Image src={"/svgs/heart.svg"} width={30} height={30} alt="Heart" className="h-fit w-fit aspect-square" />
            <span>by</span>
            <Mention icon={"/media/pfp.jpeg"} name="bimoware" href={"https://github/bimoware/"} />
        </div>
        <div className="flex gap-2 items-center justify-center">
            <span>Source code on </span>
            <Mention icon={"/svgs/github.svg"} name="bimoware/bimowy" href={"https://github.com/bimoware/bimowy/"} />
        </div>
        <div className="flex gap-2 items-center justify-center">
            <span>Inspired by</span>
            <Mention icon={"/svgs/khan-academy.svg"} name="Khan Academy" href={"https://www.khanacademy.org/"} />
        </div>
        <div className="flex gap-2 items-center justify-center">
            <span>Made using </span>
            <Mention icon={"/svgs/nextjs.svg"} name="Next.Js" href={"https://nextjs.org/"} />
            <span>and</span>
            <Mention icon={"/svgs/tailwind.svg"} padding name="TailwindCSS" href={"https://tailwindcss.com/docs/installation/framework-guides/nextjs/"} />
        </div>
    </div>
}

function Mention({ icon, name, href, padding }: { icon: string, name: string, href: string, padding?: boolean }) {
    return <Link href={href} target='_blank' >
        <div className="inline-flex gap-2 items-center p-1 px-2 rounded-xl
        transition-all
        bg-neutral-600/50 hover:bg-neutral-600
        select-none cursor-pointer hover:scale-102">
            <Image src={icon} width={50} height={50} alt={name}
                className={`h-6 w-fit aspect-square rounded-full bg-black ${padding ? "p-1" : ""}`} />
            <span className="font-bold">{name}</span>
            <Image src={"/svgs/open_in_view.svg"} width={50} height={50} alt="Open in new tab"
                className="h-4 w-fit aspect-square self-baseline" />
        </div>
    </Link>
}