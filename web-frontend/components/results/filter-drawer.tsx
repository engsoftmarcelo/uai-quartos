"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { SearchResultFilters } from "@/lib/types";
import { FilterPanel } from "./filter-panel";

export function FilterDrawer({ filters }: { filters: SearchResultFilters }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong shadow-xs transition hover:bg-surface-muted lg:hidden"
        type="button"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filtros
      </button>
      {open ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[var(--z-modal)] grid place-items-end bg-foreground/45"
          role="dialog"
          aria-labelledby="filter-drawer-title"
        >
          <aside className="max-h-[92vh] w-full overflow-auto rounded-t-md bg-surface p-4 shadow-md">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2
                  className="font-display text-xl font-bold text-foreground"
                  id="filter-drawer-title"
                >
                  Refinar resultados
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Aplique filtros claros e mantenha a busca compartilhável por
                  URL.
                </p>
              </div>
              <button
                aria-label="Fechar filtros"
                className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface"
                type="button"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <FilterPanel filters={filters} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
