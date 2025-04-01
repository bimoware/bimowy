import { Bloc } from "@/components/Bloc";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Bimowy - When math works",
  icons: "/svgs/home.svg",
  description: "Bimowy is a free open-source math practice platform for students who feel stuck when trying to train on any math subject. Through quiz-based exercises, learning becomes interactive, free from frustration and ACTUALLY fun. All to help you finally understand topics that once felt impossible. Whether you're dealing with math anxiety, burnout or just need extra practice, Bimowy gives you instant feedback to reinforce learning and boost your confidence. Built with **Next.js**, it offers a smooth and responsive experience designed for self-paced learning, homework help, and exam preparation. Stop feeling lost and start using Bimowy!",
  metadataBase: new URL(
    process.env.NODE_ENV == "production"
      ? `https://bimowy.vercel.app/`
      : 'http://localhost:3000/'
  )
};

export const viewport: Viewport = { themeColor: "#FFFFFE" }

export default function Home() {
  return <Bloc type="full-body">
    <h1>Welcome!</h1>
    <p>This home page is pretty empty right now...</p>
    <p>Maybe try checking the available exercices?</p>
  </Bloc>
}
