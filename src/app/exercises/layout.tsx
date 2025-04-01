import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Exercises",
    icons: "/svgs/exercises.svg"
};

export default function Layout({ children }: { children: ChildNode }) { return children }