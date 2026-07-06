import Link from "next/link";
import { Building2, MapPinned, Search } from "lucide-react";
import type { SearchResultFilters } from "@/lib/types";

export function ResultsPageHeader({
  filters,
}: {
  filters: SearchResultFilters;
}) {
  const place = filters.location ?? filters.campus ?? "sua faculdade";

  return (
    <header className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Resultados de exploracao
          </p>
          <h1 className="font-display text-3xl font-bold text-balance text-foreground sm:text-4xl">
            Moradias perto de {place}
          </h1>
          <p className="max-w-3xl text-pretty text-sm leading-6 text-muted sm:text-base">
            Compare custo total, valor a pagar hoje, regras da casa e
            compatibilidade de convivência em uma URL compartilhável.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
            href="/buscar"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Nova busca
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
            href="/landlord"
          >
            <Building2 className="h-4 w-4" aria-hidden="true" />
            Anunciar
          </Link>
        </div>
      </div>
      <p className="inline-flex items-center gap-2 rounded-md bg-brand-soft px-3 py-2 text-sm font-bold text-brand-strong">
        <MapPinned className="h-4 w-4" aria-hidden="true" />
        Desktop em split view; mobile abre em lista com mapa sob demanda.
      </p>
    </header>
  );
}
