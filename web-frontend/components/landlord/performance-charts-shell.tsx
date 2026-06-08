"use client";

import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandlordListing, LandlordPerformancePoint } from "@/lib/types";
import { cn } from "@/lib/utils";

type Metric = "views" | "contacts" | "applications" | "conversionRate";

const metricLabels: Record<Metric, string> = {
  applications: "Candidaturas",
  contacts: "Contatos",
  conversionRate: "Conversao",
  views: "Visualizacoes",
};

export function PerformanceChartsShell({
  listings,
  performance,
}: {
  listings: LandlordListing[];
  performance: LandlordPerformancePoint[];
}) {
  const [metric, setMetric] = useState<Metric>("views");
  const maxValue = useMemo(() => {
    const values = performance.map((point) =>
      metric === "conversionRate" ? point[metric] * 100 : point[metric],
    );
    return Math.max(...values, 1);
  }, [metric, performance]);

  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Insights
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
            Performance do inventario
          </h2>
          <p className="mt-1 text-sm text-muted">
            Acompanhe visibilidade, contatos, candidaturas e taxa de conversao.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(metricLabels) as Metric[]).map((key) => (
            <Button
              key={key}
              onClick={() => setMetric(key)}
              size="sm"
              variant={metric === key ? "primary" : "secondary"}
            >
              {metricLabels[key]}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {performance.map((point) => {
          const value =
            metric === "conversionRate" ? point[metric] * 100 : point[metric];
          const display =
            metric === "conversionRate" ? `${value.toFixed(0)}%` : String(value);

          return (
            <div
              className="grid gap-2 sm:grid-cols-[4rem_minmax(0,1fr)_4rem] sm:items-center"
              key={point.label}
            >
              <p className="text-sm font-bold text-muted-strong">{point.label}</p>
              <div className="h-3 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${Math.max((value / maxValue) * 100, 4)}%` }}
                />
              </div>
              <p className="text-sm font-bold text-muted-strong">{display}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {listings.map((listing) => (
          <article
            className={cn(
              "grid gap-2 rounded-md border p-3",
              listing.completionScore >= 85
                ? "border-success/25 bg-success-soft"
                : "border-accent/30 bg-accent-soft",
            )}
            key={listing.id}
          >
            <p className="line-clamp-1 text-sm font-bold text-muted-strong">
              {listing.title}
            </p>
            <p className="font-display text-2xl font-bold text-foreground">
              {listing.completionScore}%
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
              qualidade do anuncio
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
