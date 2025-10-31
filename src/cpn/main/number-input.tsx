"use client";
import { type Ref, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Input } from "../ui/input";

export function NumberInput({
  allowNothing,
  ref,
  disabled,
  className,
  control,
  ...props
}: React.ComponentProps<"div"> & {
  allowNothing?: boolean,
  ref: Ref<HTMLInputElement>;
  disabled?: boolean;
  className: string;
  control:
  | undefined
  | {
    onNewValue: (newValue: string) => void;
    value: string;
  };
}) {
  const [isValid, setIsValid] = useState(true);
  const [insideStateValue, setInsideStateValue] = control
    ? [control.value, control.onNewValue]
    : useState("");

  return (
    <Input
      {...{ disabled, ...props }}
      className={twMerge(
        className,
        `data-[invalid=true]:ring-orange-500/50
        data-[invalid=true]:ring-2
        !border-none ring-1 ring-accent
        w-20
        disabled:opacity-50
        disabled:hover:cursor-not-allowed`,
      )}
      data-invalid={!isValid}
      defaultValue={insideStateValue}
      onBlur={(ev) => {
        ev.target.value = insideStateValue;
        setIsValid(true);
      }}
      onChange={(ev) => {
        const newValue = ev.target.value;
        const newValueNumber = +newValue;
        if (
          (newValue === "" && allowNothing)
          || (newValue && !Number.isNaN(newValueNumber))
        ) {
          setInsideStateValue(newValue);
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      }}
      ref={ref}
    />
  );
}
