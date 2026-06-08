"use client";

import type { TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  disabledReason?: string;
  error?: string;
  hint?: string;
  label?: string;
}

export function Textarea({
  className,
  disabled,
  disabledReason,
  error,
  hint,
  id,
  label,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const disabledId = disabledReason ? `${textareaId}-disabled` : undefined;

  return (
    <div className="grid gap-2">
      {label ? (
        <label
          className="text-sm font-bold text-muted-strong"
          htmlFor={textareaId}
        >
          {label}
        </label>
      ) : null}
      <textarea
        aria-describedby={cn(hintId, errorId, disabled ? disabledId : undefined)}
        aria-invalid={Boolean(error)}
        className={cn(
          "min-h-28 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-xs transition duration-150 placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-surface-muted disabled:text-muted",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className,
        )}
        disabled={disabled}
        id={textareaId}
        {...props}
      />
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
