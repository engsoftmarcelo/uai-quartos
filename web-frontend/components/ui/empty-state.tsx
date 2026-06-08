import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  title: string;
}

export function EmptyState({
  action,
  children,
  className,
  icon = <SearchX className="h-5 w-5" />,
  title,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "grid gap-4 rounded-md border border-dashed border-border-strong bg-surface-raised p-5 text-left",
        className,
      )}
    >
      <div className="grid h-11 w-11 place-items-center rounded-md bg-surface-muted text-muted-strong">
        {icon}
      </div>
      <div className="grid gap-1">
        <h2 className="font-display text-xl font-bold text-foreground">
          {title}
        </h2>
        {children ? <p className="text-sm leading-6 text-muted">{children}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </section>
  );
}
