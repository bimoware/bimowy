import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Exercises",
    icons: "/svgs/exercises.svg"
};

export default function Layout({ children }: { children: ReactNode }) { return children }