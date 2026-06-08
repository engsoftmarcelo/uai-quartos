import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  className?: string;
  description: string;
  icon?: ReactNode;
  label: string;
  value: string;
}

export function StatCard({
  className,
  description,
  icon,
  label,
  value,
}: StatCardProps) {
  return (
    <article
      className={cn(
        "grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-muted">{label}</p>
        {icon ? (
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-soft text-brand">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
