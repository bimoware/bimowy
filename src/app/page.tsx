import { Bloc } from "@/components/Bloc";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Bimowy - When math works",
  icons: "/svgs/home.svg",
  description: "Bimowy is a free, open-source, exercices-focused math platform for students who feel stuck when trying to train on any math subject."
    + " With interactive learning and feedback loop, math becomes free from frustration and starts being actually fun.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_VERCEL_URL
    ? ("https://" + process.env.NEXT_PUBLIC_VERCEL_URL)
    : 'http://localhost:3000/')
};

export const viewport: Viewport = { themeColor: "#FFFFFE" }

export default function Home() {
  return <Bloc type="full-body">
    <h1>Welcome!</h1>
    <p>This home page is pretty empty right now...</p>
    <p>Maybe try checking the available exercices?</p>
  </Bloc>
}
