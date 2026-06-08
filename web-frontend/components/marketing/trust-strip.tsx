import { BadgeCheck, Clock3, FileCheck2 } from "lucide-react";
import { trustMetrics } from "@/lib/constants";

const icons = [BadgeCheck, Clock3, FileCheck2];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="uai-container grid gap-4 py-5 sm:grid-cols-3">
        {trustMetrics.map((metric, index) => {
          const Icon = icons[index] ?? BadgeCheck;

          return (
            <div
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3"
              key={metric.label}
            >
              <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-soft text-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {metric.value}
                </p>
                <p className="text-sm text-muted">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
