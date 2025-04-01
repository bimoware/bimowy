import { ReactNode } from "react";

export function Bloc({ type, children }: {
    type: "sidebar" | "full-body",
    children: ReactNode
}) {
    const styles = {
        "sidebar": "p-2 flex-col items-baseline w-18 shrink-0 h-fit",
        "full-body": "p-7 w-full items-baseline"
    }
    return <div className={`bg-neutral-900 m-4 rounded-3xl
    flex overflow-y-scroll
     ${styles[type]}`}>
        {children}
    </div>
}