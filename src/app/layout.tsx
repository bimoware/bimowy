import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type { ReactNode } from "react";
import "./style.css";
import SideBarWrapper from "@/cpn/main/SidebarWrapper";

const outfitFont = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  description:
    "Free & Open source platform where you can choose any math subject and train on it repeatedly with automatically-generated exercises. You can set the options for the difficulty, number of questions, numbers range etc..",
  title: "Bimowy",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfitFont.className} dark`}>
        <SideBarWrapper>
          {children}
        </SideBarWrapper>
      </body>
    </html>
  );
}
