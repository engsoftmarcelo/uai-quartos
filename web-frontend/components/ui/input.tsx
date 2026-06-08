"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabledReason?: string;
  error?: string;
  hint?: string;
  inputSize?: "sm" | "md" | "lg";
  label?: string;
  leadingIcon?: ReactNode;
  trailingElement?: ReactNode;
}

export function Input({
  className,
  disabled,
  disabledReason,
  error,
  hint,
  id,
  inputSize = "md",
  label,
  leadingIcon,
  trailingElement,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const disabledId = disabledReason ? `${inputId}-disabled` : undefined;

  return (
    <div className="grid gap-2">
      {label ? (
        <label className="text-sm font-bold text-muted-strong" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leadingIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {leadingIcon}
          </span>
        ) : null}
        <input
          aria-describedby={cn(hintId, errorId, disabled ? disabledId : undefined)}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full rounded-md border border-border bg-surface text-foreground shadow-xs transition duration-150 placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-surface-muted disabled:text-muted",
            inputSize === "sm" && "h-9 px-3 text-sm",
            inputSize === "md" && "h-11 px-3 text-sm",
            inputSize === "lg" && "h-12 px-4 text-base",
            Boolean(leadingIcon) && "pl-10",
            Boolean(trailingElement) && "pr-10",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className,
          )}
          disabled={disabled}
          id={inputId}
          {...props}
        />
        {trailingElement ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
            {trailingElement}
          </span>
        ) : null}
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
