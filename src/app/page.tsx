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
  return <>
    <h1>Bimowy</h1></>
}
