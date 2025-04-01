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
  return <div className="grow flex m-4 gap-4">
    <div className="grow flex flex-col gap-5">
      <h1 className="mt-2 ml-4">Addition - Question 4/10</h1>
      <div className="grow flex bg-neutral-900 rounded-3xl p-4">
        [...Context]
      </div>
    </div>
    <div className="grow flex bg-neutral-900 rounded-3xl p-4">
      [...Inputs]
    </div>
  </div>
}