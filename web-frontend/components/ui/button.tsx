"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong shadow-xs",
  secondary:
    "border border-border bg-surface text-muted-strong hover:bg-surface-muted",
  ghost: "bg-transparent text-muted-strong hover:bg-surface-muted",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabledReason?: string;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  children,
  className,
  disabled,
  disabledReason,
  isLoading = false,
  leftIcon,
  rightIcon,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const generatedId = useId();
  const descriptionId = disabledReason ? `${generatedId}-disabled` : undefined;
  const isDisabled = disabled || isLoading;

  return (
    <>
      <button
        aria-describedby={isDisabled ? descriptionId : undefined}
        aria-disabled={isDisabled}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-bold transition duration-150 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)] disabled:opacity-60",
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
          leftIcon
        )}
        <span>{children}</span>
        {rightIcon}
      </button>
      {isDisabled && disabledReason ? (
        <span className="sr-only" id={descriptionId}>
          {disabledReason}
        </span>
      ) : null}
    </>
  );
}
