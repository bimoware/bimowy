"use client";

import { Bloc } from "@/components/Bloc";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SideBar() {
    return <Bloc type="sidebar">
        {[
            { id: "home", data: { icon: "/svgs/home.svg", path: "", label: "Home" } },
            { id: 'test', data: { icon: "/svgs/test.svg", path: "test", label: "Test" } },
            { id: 'ex', data: { icon: "/svgs/exercises.svg", path: "exercises", label: "Exercises" } }
        ]
            .map(btn => <SideBarIcon {...btn.data} key={btn.id} />)}
    </Bloc>;
}

function SideBarIcon({ icon, path, label }: { icon: string, path: string, label: string }) {
    const pathname = usePathname().split('/')[1] || ""; // Get the current path without the leading slash
    const isActive = pathname === path; // Check if the current path matches the icon's path

    return (
        <Link
            href={`/${path}`}
            className={`aspect-square rounded-xl p-2 m-1 transition-transform hover:scale-105 hover:translate-x-1
                ${isActive ? "bg-neutral-50/5" : "hover:bg-neutral-50/5 opacity-90"}
            `}
        >
            <Image src={icon} alt={label} width={30} height={30} />
        </Link>
    );
}
