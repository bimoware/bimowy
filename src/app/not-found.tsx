import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page not found",
    description: "Unknown page",
    icons: "/svgs/report.svg"
};

export default function NotFound() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h1>Page Not Found (404)</h1>
            <p>Sorrwy, couldn&apos;t get to where you wanted to go 😔..</p>
        </div>
    )
}