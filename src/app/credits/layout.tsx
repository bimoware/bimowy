import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Credits",
    icons: "/svgs/crown.svg"
};

export default function Layout({ children }: { children: ReactNode }) { return children }