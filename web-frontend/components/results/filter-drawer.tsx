"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { SearchResultFilters } from "@/lib/types";
import { FilterPanel } from "./filter-panel";

function countActiveFilters(filters: SearchResultFilters): number {
  let count = 0;

  for (const [key, value] of Object.entries(filters)) {
    // sort e view são estado de exibição, não filtros
    if (key === "sort" || key === "view") continue;
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      count += value.length;
      continue;
    }
    count += 1;
  }

  return count;
}

export function FilterDrawer({ filters }: { filters: SearchResultFilters }) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong shadow-xs transition hover:bg-surface-muted lg:hidden"
        type="button"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filtrar
        {activeCount > 0 ? (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-white">
            {activeCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[var(--z-modal)] grid place-items-end bg-foreground/45"
          role="dialog"
          aria-labelledby="filter-drawer-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <aside className="max-h-[92vh] w-full overflow-auto rounded-t-md bg-surface p-4 pb-6 shadow-md">
            <div
              aria-hidden="true"
              className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border-strong"
            />
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2
                  className="font-display text-xl font-bold text-foreground"
                  id="filter-drawer-title"
                >
                  Filtrar quartos
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {activeCount > 0
                    ? `${activeCount} filtro${activeCount > 1 ? "s" : ""} aplicado${activeCount > 1 ? "s" : ""}`
                    : "Preço, distância, tipo de quarto e convivência."}
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
