import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  title: ReactNode;
}

export function SectionHeader({
  action,
  align = "left",
  className,
  eyebrow,
  subtitle,
  title,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "grid gap-3",
        Boolean(action) && "sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      <div className="grid gap-2">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-2xl text-pretty text-base leading-7 text-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
