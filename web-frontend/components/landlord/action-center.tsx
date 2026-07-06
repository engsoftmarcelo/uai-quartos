import Link from "next/link";
import { AlertTriangle, ArrowRight, CircleAlert, Info } from "lucide-react";
import type { LandlordTask } from "@/lib/types";

const iconBySeverity = {
  critical: CircleAlert,
  info: Info,
  warning: AlertTriangle,
} as const;

const textBySeverity = {
  critical: "text-danger",
  info: "text-brand",
  warning: "text-accent",
} as const;

export function ActionCenter({ tasks }: { tasks: LandlordTask[] }) {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Central de ações
        </h2>
        <p className="mt-1 text-sm text-muted">
          Tarefas que reduzem erro operacional e melhoram conversao.
        </p>
      </div>

      <div className="grid gap-2">
        {tasks.map((task) => {
          const Icon = iconBySeverity[task.severity];

          return (
            <Link
              className="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] gap-3 rounded-md border border-border bg-surface-raised p-3 transition hover:bg-surface-muted"
              href={task.href}
              key={task.id}
            >
              <Icon
                className={`mt-1 h-5 w-5 ${textBySeverity[task.severity]}`}
                aria-hidden="true"
              />
              <span className="grid gap-1">
                <span className="text-sm font-bold text-muted-strong">
                  {task.label}
                </span>
                <span className="text-sm leading-6 text-muted">
                  {task.description}
                </span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 text-muted" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
