import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Exercising...",
    icons: "/svgs/exercise.svg"
};

export default function Layout({ children }: { children: ChildNode }) { return children }