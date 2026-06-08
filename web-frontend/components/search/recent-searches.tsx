import Link from "next/link";
import { Clock3 } from "lucide-react";
import { recentSearches } from "@/lib/constants";

export function RecentSearches() {
  return (
    <section className="grid gap-3" aria-labelledby="recent-searches-title">
      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-brand" aria-hidden="true" />
        <h2
          className="text-sm font-bold uppercase tracking-[0.12em] text-muted"
          id="recent-searches-title"
        >
          Buscas recentes
        </h2>
      </div>
      <div className="grid gap-2">
        {recentSearches.map((search) => (
          <Link
            className="grid gap-1 rounded-md border border-border bg-surface p-3 text-sm transition hover:bg-surface-muted"
            href={search.href}
            key={search.id}
          >
            <span className="font-bold text-muted-strong">{search.label}</span>
            <span className="text-muted">{search.meta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
