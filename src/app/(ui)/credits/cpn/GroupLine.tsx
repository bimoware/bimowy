import { ReactNode } from "react";

export function GroupLine({ children }: { children: ReactNode }) {
  return <div
    className="inline-flex gap-2 items-center justify-center *:items-center flex-wrap
    animate-appear">
    {children}
  </div>
}