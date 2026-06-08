import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { StudentSavedListing } from "@/lib/types";
import { SavedListingCard } from "./saved-listing-card";
import { StudentEmptyState } from "./student-empty-state";

export function SavedListingsPanel({
  listings,
}: {
  listings: StudentSavedListing[];
}) {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Anuncios salvos
          </h2>
          <p className="mt-1 text-sm text-muted">
            Sua shortlist viva, com mudancas recentes.
          </p>
        </div>
        <Link
          className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm font-bold text-brand hover:bg-brand-soft"
          href="/favoritos"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {listings.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {listings.slice(0, 3).map((listing) => (
            <SavedListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <StudentEmptyState
          actionHref="/buscar/resultados"
          actionLabel="Buscar moradias"
          title="Nenhum favorito ainda"
        >
          Salve anuncios para comparar preco, campus e match sem recomecar a
          busca.
        </StudentEmptyState>
      )}
    </section>
  );
}
