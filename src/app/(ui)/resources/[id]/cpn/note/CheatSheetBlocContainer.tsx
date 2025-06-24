import { ReactNode } from "react";

export default function CheatSheetBlocContainer({ children, title }: { children: ReactNode, title?: string }) {
    return <div className="flex flex-col items-center
    gap-4 p-3 px-5 w-fit
    bg-neutral-900 rounded-3xl
    relative">
        {title && <span className="absolute bg-neutral-900
        -top-7 left-2
        px-3 py-1
        rounded-xl
        -rotate-2
        font-bold text-xl
        duration-150 hover:-translate-y-2 hover:scale-105 hover:-rotate-1
        select-none shadow-md">{title}</span>}
        {children}
    </div>
}