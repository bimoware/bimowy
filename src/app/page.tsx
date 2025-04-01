import { Bloc } from "@/components/Bloc";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Home",
    template: "%s | Bimowy"
  },
  description: "Home Page",
  icons: "/svgs/home.svg"
};

export default function Home() {
  return <Bloc type="full-body">
    <h1>Welcome!</h1>
    <span>This home page is pretty empty right now... Maybe try checking the available exercices?</span>
  </Bloc>
}
