import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

import "./style.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SideBar />
        <Body>
          {children}
        </Body>
      </body>
    </html>
  );
}


function Body({ children }: { children: ReactNode }) {
  return <Section id="body" className="w-full p-6">{children}</Section>
}
function Section({ id, className, children }: { id: string, className?: string, children: React.ReactNode }) {
  return <div id={id} className={`bg-neutral-900 m-4 rounded-3xl p-2 ${className}`}>
    {children}
  </div>
}

function SideBar() {
  return <Section id="sidebar" className="flex flex-col items-center">
    {
      [
        { id: "home", data: { icon: "/svgs/home.svg", path: "/", label: "Home" } },
        { id: 'test', data: { icon: "/svgs/test.svg", path: "/test", label: "Test" } },
        { id: 'ex', data: { icon: "/svgs/exercices.svg", path: "/exercices", label: "Exercices" } }
      ]
        .map(btn => <SideBarIcon {...btn.data} key={btn.id} />)
    }
  </Section>
}

function SideBarIcon({ icon, path, label }: { icon: string, path: string, label: string }) {
  return <Link href={path} className="aspect-square rounded-xl 
  hover:bg-neutral-50/5 hover:scale-105
  p-2 m-1">
    <Image src={icon} alt={label} width={40} height={40} />
  </Link>

}
