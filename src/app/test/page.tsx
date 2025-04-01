import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Test",
    template: "%s | Bimowy"
  },
  description: "Test Page",
  icons: "/svgs/test.svg"
};

export default function TestPage() {
  return <></>
}