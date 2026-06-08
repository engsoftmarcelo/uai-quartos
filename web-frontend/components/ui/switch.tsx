"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  disabledReason?: string;
  label: ReactNode;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
  checked,
  defaultChecked = false,
  description,
  disabled,
  disabledReason,
  label,
  name,
  onCheckedChange,
}: SwitchProps) {
  const id = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;
  const descriptionId = description ? `${id}-description` : undefined;
  const disabledId = disabledReason ? `${id}-disabled` : undefined;

  function toggle() {
    if (disabled) return;
    const next = !isChecked;

    if (checked === undefined) {
      setInternalChecked(next);
    }

    onCheckedChange?.(next);
  }

  return (
    <div className="grid gap-2">
      <button
        aria-checked={isChecked}
        aria-describedby={cn(descriptionId, disabled ? disabledId : undefined)}
        aria-disabled={disabled}
        className={cn(
          "grid w-full grid-cols-[minmax(0,1fr)_3rem] items-center gap-3 rounded-md border border-border bg-surface p-3 text-left shadow-xs transition hover:bg-surface-muted",
          isChecked && "border-brand bg-brand-soft",
          disabled && "opacity-60",
        )}
        disabled={disabled}
        role="switch"
        type="button"
        onClick={toggle}
      >
        <span className="grid gap-1">
          <span className="text-sm font-bold text-muted-strong">{label}</span>
          {description ? (
            <span className="text-sm text-muted" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "relative h-7 rounded-full bg-border-strong transition",
            isChecked && "bg-brand",
          )}
        >
          <span
            className={cn(
              "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-xs transition",
              isChecked && "translate-x-5",
            )}
          />
        </span>
      </button>
      {name ? (
        <input name={name} type="hidden" value={isChecked ? "true" : "false"} />
      ) : null}
      {disabled && disabledReason ? (
        <p className="text-sm text-muted" id={disabledId}>
          {disabledReason}
        </p>
      ) : null}
    </div>
  );
}
