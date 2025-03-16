import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page not found",
    description: "Unknown page",
    icons: "/svgs/report.svg"
};

export default function NotFound() {
    return (
        <div>
            <h2>Page Not Found (404)</h2>
            <p>Sorrwy, couldn&apos;t get to where you wanted to go 😔..</p>
        </div>
    )
}