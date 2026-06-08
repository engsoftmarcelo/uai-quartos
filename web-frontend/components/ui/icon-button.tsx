"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonVariant } from "./button";

export type IconButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong shadow-xs",
  secondary:
    "border border-border bg-surface text-muted-strong hover:bg-surface-muted",
  ghost: "bg-transparent text-muted-strong hover:bg-surface-muted",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children"> {
  disabledReason?: string;
  icon: ReactNode;
  isLoading?: boolean;
  label: string;
  size?: IconButtonSize;
  variant?: ButtonVariant;
}

export function IconButton({
  className,
  disabled,
  disabledReason,
  icon,
  isLoading = false,
  label,
  size = "md",
  type = "button",
  variant = "secondary",
  ...props
}: IconButtonProps) {
  const generatedId = useId();
  const descriptionId = disabledReason ? `${generatedId}-disabled` : undefined;
  const isDisabled = disabled || isLoading;

  return (
    <>
      <button
        aria-describedby={isDisabled ? descriptionId : undefined}
        aria-disabled={isDisabled}
        aria-label={label}
        className={cn(
          "inline-grid shrink-0 place-items-center rounded-md transition duration-150 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)] disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={isDisabled}
        type={type}
        {...props}
      >
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          icon
        )}
      </button>
      {isDisabled && disabledReason ? (
        <span className="sr-only" id={descriptionId}>
          {disabledReason}
        </span>
      ) : null}
    </>
  );
}
