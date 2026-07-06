import type { ListingSearchResult } from "@/lib/types";
import { ListingSearchCard } from "./listing-search-card";
import { HoverSyncArea } from "./map-sync-context";
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
        <HoverSyncArea key={listing.id} listingId={listing.id}>
          <ListingSearchCard listing={listing} />
        </HoverSyncArea>
      ))}
    </section>
  );
}
