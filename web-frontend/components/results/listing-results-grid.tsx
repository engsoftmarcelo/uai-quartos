import type { ListingSearchResult } from "@/lib/types";
import { ListingSearchCard } from "./listing-search-card";
import { NoResultsState } from "./no-results-state";

export function ListingResultsGrid({
  listings,
}: {
  listings: ListingSearchResult[];
}) {
  if (!listings.length) {
    return <NoResultsState />;
  }

  return (
    <section className="grid gap-4" aria-label="Lista de moradias encontradas">
      {listings.map((listing) => (
        <ListingSearchCard key={listing.id} listing={listing} />
      ))}
    </section>
  );
}
