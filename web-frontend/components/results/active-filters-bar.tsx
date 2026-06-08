import Link from "next/link";
import { X } from "lucide-react";
import type { ActiveFilter } from "@/lib/types";

export function ActiveFiltersBar({
  activeFilters,
}: {
  activeFilters: ActiveFilter[];
}) {
  return (
    <section
      className="grid gap-2 rounded-md border border-border bg-surface p-3"
      aria-label="Filtros aplicados"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-muted-strong">
          Filtros aplicados
        </h2>
        {activeFilters.length ? (
          <Link
            className="text-sm font-bold text-brand transition hover:text-brand-strong"
            href="/buscar/resultados"
          >
            limpar todos
          </Link>
        ) : null}
      </div>
      {activeFilters.length ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {activeFilters.map((filter) => (
            <Link
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-surface-muted px-3 text-sm font-bold text-muted-strong transition hover:bg-border"
              href={filter.href}
              key={filter.key}
            >
              {filter.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Nenhum filtro aplicado ainda. Use os chips ou o painel para refinar.
        </p>
      )}
    </section>
  );
}
