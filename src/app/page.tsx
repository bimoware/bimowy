import { Bloc } from "@/components/Bloc";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bimowy",
  icons: "/svgs/home.svg"
};

export default function Home() {
  return <Bloc type="full-body">
    <h1>Welcome!</h1>
    <p>This home page is pretty empty right now...</p>
    <p>Maybe try checking the available exercices?</p>
  </Bloc>
}
