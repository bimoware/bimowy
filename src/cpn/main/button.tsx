import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button as ShadcnButton } from "../ui/button";

export function Button({
  id,
  onClick,
  disabled,
  children,
  className,
  variant = "default",
}: {
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  variant?: Parameters<typeof ShadcnButton>["0"]["variant"];
}) {
  return (
    <ShadcnButton
      {...{ id }}
      className={twMerge(
        `font-semibold cursor-pointer
    hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed`,
        className,
      )}
      {...{ disabled, onClick, variant }}
    >
      {children}
    </ShadcnButton>
  );
}
