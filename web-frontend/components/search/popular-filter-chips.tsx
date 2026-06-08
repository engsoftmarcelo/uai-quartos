import Link from "next/link";
import { Sparkles } from "lucide-react";
import { filterShortcuts } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface PopularFilterChipsProps {
  activeIds?: string[];
  className?: string;
}

export function PopularFilterChips({
  activeIds = [],
  className,
}: PopularFilterChipsProps) {
  return (
    <section className={cn("grid gap-3", className)} aria-label="Filtros populares">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted">
          Atalhos populares
        </h2>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterShortcuts.map((shortcut) => {
          const isActive = activeIds.includes(shortcut.id);

          return (
            <Link
              className={cn(
                "inline-flex h-10 shrink-0 items-center rounded-md border px-3 text-sm font-bold transition",
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-muted-strong hover:bg-surface-muted",
              )}
              href={shortcut.href}
              key={shortcut.id}
              title={shortcut.description}
            >
              {shortcut.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
