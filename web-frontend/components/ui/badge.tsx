import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "accent"
  | "success"
  | "danger"
  | "signal";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-muted-strong",
  brand: "bg-brand-soft text-brand-strong",
  accent: "bg-accent-soft text-[#6c4a05]",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  signal: "bg-signal-soft text-signal",
};

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  tone?: BadgeTone;
}

export function Badge({
  children,
  className,
  icon,
  tone = "neutral",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 max-w-full items-center gap-1.5 rounded-md px-2 text-xs font-bold",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      <span className="truncate">{children}</span>
    </span>
  );
}
