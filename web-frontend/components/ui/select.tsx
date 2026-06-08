"use client";

import type { SelectHTMLAttributes } from "react";
import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  disabledReason?: string;
  error?: string;
  hint?: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  className,
  disabled,
  disabledReason,
  error,
  hint,
  id,
  label,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const disabledId = disabledReason ? `${selectId}-disabled` : undefined;

  return (
    <div className="grid gap-2">
      {label ? (
        <label className="text-sm font-bold text-muted-strong" htmlFor={selectId}>
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          aria-describedby={cn(hintId, errorId, disabled ? disabledId : undefined)}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-11 w-full appearance-none rounded-md border border-border bg-surface px-3 pr-10 text-sm text-foreground shadow-xs transition duration-150 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-surface-muted disabled:text-muted",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className,
          )}
          disabled={disabled}
          id={selectId}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option
              disabled={option.disabled}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
      </div>
      {hint ? (
        <p className="text-sm text-muted" id={hintId}>
          {hint}
        </p>
      ) : null}
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
