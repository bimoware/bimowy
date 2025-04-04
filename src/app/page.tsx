import { Bloc } from "@cpn/Bloc";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Bimowy - When math works",
  icons: "/svgs/home.svg",
  description: "Bimowy is a free, open-source, exercices-focused math platform for students who feel stuck when trying to train on any math subject."
    + " With interactive learning and feedback loop, math becomes free from frustration and starts being actually fun.",
  metadataBase: new URL(
    process.env.NODE_ENV == "production"
      ? `https://bimowy.vercel.app/`
      : 'http://localhost:3000/'
  ),
  twitter: {
    card: "summary"
  }
};

export const viewport: Viewport = { themeColor: "#FFFFFE" }

export default function Home() {
  return <Bloc type="full-body">
    <h1>Bimowy</h1>
    <p>Not much to see here...</p>
  </Bloc>
}
