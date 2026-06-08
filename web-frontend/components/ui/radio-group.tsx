"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  description?: ReactNode;
  disabled?: boolean;
  disabledReason?: string;
  label: ReactNode;
  value: string;
}

export interface RadioGroupProps {
  defaultValue?: string;
  error?: string;
  label: string;
  name: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  value?: string;
}

export function RadioGroup({
  defaultValue,
  error,
  label,
  name,
  onValueChange,
  options,
  value,
}: RadioGroupProps) {
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const selectedValue = value ?? internalValue;
  const errorId = error ? `${generatedId}-error` : undefined;

  function selectOption(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <fieldset aria-describedby={errorId} className="grid gap-2">
      <legend className="text-sm font-bold text-muted-strong">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const optionId = `${generatedId}-${option.value}`;
          const disabledId = option.disabledReason
            ? `${optionId}-disabled`
            : undefined;

          return (
            <label
              className={cn(
                "grid min-h-16 cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] gap-3 rounded-md border border-border bg-surface p-3 text-sm shadow-xs transition hover:bg-surface-muted",
                selectedValue === option.value &&
                  "border-brand bg-brand-soft text-brand-strong",
                option.disabled && "cursor-not-allowed opacity-60",
              )}
              htmlFor={optionId}
              key={option.value}
            >
              <span className="relative mt-0.5 grid h-5 w-5 place-items-center">
                <input
                  aria-describedby={option.disabled ? disabledId : undefined}
                  checked={selectedValue === option.value}
                  className="peer h-5 w-5 appearance-none rounded-full border border-border bg-surface transition checked:border-brand checked:border-[6px] focus:outline-none focus:ring-2 focus:ring-brand/20"
                  disabled={option.disabled}
                  id={optionId}
                  name={name}
                  type="radio"
                  value={option.value}
                  onChange={() => selectOption(option.value)}
                />
              </span>
              <span className="grid gap-1">
                <span className="font-bold">{option.label}</span>
                {option.description ? (
                  <span className="text-muted">{option.description}</span>
                ) : null}
                {option.disabled && option.disabledReason ? (
                  <span className="text-muted" id={disabledId}>
                    {option.disabledReason}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="text-sm font-medium text-danger" id={errorId}>
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
