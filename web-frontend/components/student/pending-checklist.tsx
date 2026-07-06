import Link from "next/link";
import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import type { StudentChecklistItem } from "@/lib/types";

const iconByStatus = {
  done: CheckCircle2,
  pending: Circle,
  warning: AlertTriangle,
} as const;

export function PendingChecklist({ items }: { items: StudentChecklistItem[] }) {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Pendencias
        </h2>
        <p className="mt-1 text-sm text-muted">
          Pequenas ações que aumentam confiança e reduzem ansiedade.
        </p>
      </div>
      <div className="grid gap-2">
        {items.map((item) => {
          const Icon = iconByStatus[item.status];

          return (
            <Link
              className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 rounded-md border border-border bg-surface-raised p-3 transition hover:bg-surface-muted"
              href={item.href}
              key={item.id}
            >
              <Icon
                className={
                  item.status === "done"
                    ? "mt-1 h-5 w-5 text-success"
                    : item.status === "warning"
                      ? "mt-1 h-5 w-5 text-accent"
                      : "mt-1 h-5 w-5 text-muted"
                }
                aria-hidden="true"
              />
              <span className="grid gap-1">
                <span className="text-sm font-bold text-muted-strong">
                  {item.label}
                </span>
                <span className="text-sm leading-6 text-muted">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
