import type { SearchResultFilters } from "@/lib/types";
import { FilterPanel } from "./filter-panel";

export function DesktopFiltersSidebar({
  filters,
}: {
  filters: SearchResultFilters;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 grid max-h-[calc(100vh-7rem)] gap-4 overflow-auto rounded-md border border-border bg-surface p-4 shadow-xs">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Filtros avancados
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Refine custo, convivência, regras da casa e deslocamento.
          </p>
        </div>
        <FilterPanel filters={filters} submitLabel="Aplicar no desktop" />
      </div>
    </aside>
  );
}
