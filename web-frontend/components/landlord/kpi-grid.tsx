import {
  Activity,
  BarChart3,
  MessageCircle,
  TimerReset,
} from "lucide-react";
import type { LandlordKPI } from "@/lib/types";

const icons = [Activity, MessageCircle, TimerReset, BarChart3] as const;

export function KPIGrid({ kpis }: { kpis: LandlordKPI[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = icons[index % icons.length];

        return (
          <article
            className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs"
            key={kpi.id}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-muted">{kpi.label}</p>
              <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-soft text-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-foreground">
              {kpi.value}
            </p>
            <p className="text-sm leading-6 text-muted">{kpi.description}</p>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-success">
              {kpi.trendLabel}
            </p>
          </article>
        );
      })}
    </section>
  );
}
