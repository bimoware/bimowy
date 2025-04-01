import { Bloc } from "@/components/Bloc";
import Link from "next/link";
import Image from "next/image";

export function SideBar() {
    return <Bloc type="sidebar">
        {[
            { id: "home", data: { icon: "/svgs/home.svg", path: "/", label: "Home" } },
            { id: 'test', data: { icon: "/svgs/test.svg", path: "/test", label: "Test" } },
            { id: 'ex', data: { icon: "/svgs/exercises.svg", path: "/exercises", label: "Exercises" } }
        ]
            .map(btn => <SideBarIcon {...btn.data} key={btn.id} />)}
    </Bloc>;
}

function SideBarIcon({ icon, path, label }: { icon: string, path: string, label: string }) {
    return <Link href={path} className="aspect-square rounded-xl
    hover:bg-neutral-50/5 hover:scale-105
    p-2 m-1">
        <Image src={icon} alt={label} width={30} height={30} />
    </Link>
}
