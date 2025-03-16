import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return <>
    <SideBar />
    <Body />
  </>
}
export function SideBarIcon({ icon, path, label }: { icon: string, path: string, label: string }) {
  return <Link href={path} className="aspect-square rounded-xl 
  hover:bg-neutral-50/5 hover:scale-105
  p-2 m-1">
    <Image src={icon} alt={label} layout="intrinsic" width={40} height={40} />
  </Link>

}

export function Section({ id, className, children }: { id: string, className?: string, children: React.ReactNode }) {
  return <div id={id} className={`bg-neutral-900 m-4 rounded-3xl p-2 ${className}`}>
    {children}
  </div>
}

export function SideBar() {
  return <Section id="sidebar" className="flex flex-col items-center">
    {
      [
        { id: "home", data: { icon: "/svgs/home.svg", path: "/", label: "Home" } },
        { id: 'test', data: { icon: "/svgs/test.svg", path: "/test", label: "Test Page", key: "test" } }
      ]
        .map(btn => <SideBarIcon {...btn.data} key={btn.id} />)
    }
  </Section>
}

export function Body() {
  return <Section id="body" className="w-full p-6">[Body]</Section>
}
