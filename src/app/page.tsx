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
    {Array.from({ length: 1000 }).map((e, i) => "HOME" + i).join(' ')}
  </Bloc>
}
