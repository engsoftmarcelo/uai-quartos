import { SlidersHorizontal } from "lucide-react";
import { ListingCard } from "@/components/listing/listing-card";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import type { ListingPreview } from "@/lib/types";

export interface SearchResultsSectionProps {
  copy: string;
  listings: ListingPreview[];
}

export function SearchResultsSection({ copy, listings }: SearchResultsSectionProps) {
  return (
    <section className="grid gap-5">
      <SectionHeader
        action={
          <span className="inline-flex h-10 items-center gap-2 rounded-md bg-surface-muted px-3 text-sm font-bold text-muted-strong">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {listings.length} resultado{listings.length === 1 ? "" : "s"}
          </span>
        }
        eyebrow="Resultados"
        subtitle={copy}
        title="Quartos que combinam com sua rotina"
      />
      {listings.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <SearchEmptyState />
      )}
    </section>
  );
}
