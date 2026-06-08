import Link from "next/link";
import { Sparkles } from "lucide-react";
import { resultsPromotedFilters } from "@/lib/constants";
import type { SearchResultFilters } from "@/lib/types";
import { buildResultsHref, isPromotedFilterActive } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PromotedFilterChips({
  filters,
}: {
  filters: SearchResultFilters;
}) {
  const hrefFor = (id: string, fallback: string) => {
    if (id === "commute") return buildResultsHref(filters, { commuteMax: 10 });
    if (id === "bills") return buildResultsHref(filters, { billsIncluded: true });
    if (id === "study") {
      return buildResultsHref(filters, { noise: "quiet", study: true });
    }
    if (id === "furnished") {
      return buildResultsHref(filters, { furnished: true });
    }
    if (id === "due-today") {
      return buildResultsHref(filters, { dueTodayMax: 700 });
    }

    return fallback;
  };

  return (
    <section className="grid gap-3" aria-label="Filtros promovidos">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted">
          Promoted filters
        </h2>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {resultsPromotedFilters.map((chip) => {
          const active = isPromotedFilterActive(filters, chip.id);

          return (
            <Link
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center rounded-md border px-3 text-sm font-bold transition",
                active
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-muted-strong hover:bg-surface-muted",
              )}
              href={hrefFor(chip.id, chip.href)}
              key={chip.id}
              title={chip.description}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
