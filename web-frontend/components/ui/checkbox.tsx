"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  description?: ReactNode;
  disabledReason?: string;
  error?: string;
  label: ReactNode;
}

export function Checkbox({
  className,
  description,
  disabled,
  disabledReason,
  error,
  id,
  label,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const descriptionId = description ? `${checkboxId}-description` : undefined;
  const errorId = error ? `${checkboxId}-error` : undefined;
  const disabledId = disabledReason ? `${checkboxId}-disabled` : undefined;

  return (
    <div className="grid gap-2">
      <label
        className={cn(
          "grid cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] gap-3 text-sm text-muted-strong",
          disabled && "cursor-not-allowed opacity-65",
          className,
        )}
        htmlFor={checkboxId}
      >
        <span className="relative mt-0.5 grid h-5 w-5 place-items-center">
          <input
            aria-describedby={cn(
              descriptionId,
              errorId,
              disabled ? disabledId : undefined,
            )}
            aria-invalid={Boolean(error)}
            className="peer h-5 w-5 appearance-none rounded-sm border border-border bg-surface shadow-xs transition checked:border-brand checked:bg-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-surface-muted"
            disabled={disabled}
            id={checkboxId}
            type="checkbox"
            {...props}
          />
          <Check
            aria-hidden="true"
            className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition peer-checked:opacity-100"
          />
        </span>
        <span className="grid gap-1">
          <span className="font-bold">{label}</span>
          {description ? (
            <span className="text-muted" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
      {error ? (
        <p className="text-sm font-medium text-danger" id={errorId}>
          {error}
        </p>
      ) : null}
      {disabled && disabledReason ? (
        <p className="text-sm text-muted" id={disabledId}>
          {disabledReason}
        </p>
      ) : null}
    </div>
  );
}
