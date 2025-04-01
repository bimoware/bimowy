import { Outfit } from 'next/font/google'
import { SideBar } from "../components/SideBar";

import "./style.css";

const outfit = Outfit({
  subsets: ['latin'],
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.className}>
      <body className="flex w-screen h-screen">
        <SideBar />
        {children}
      </body>
    </html>
  );
}