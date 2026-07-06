import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ListingCard } from "@/components/listing/listing-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { ListingPreview } from "@/lib/types";

export interface FeaturedListingCarouselProps {
  listings: ListingPreview[];
  subtitle?: string;
  title?: string;
}

export function FeaturedListingCarousel({
  listings,
  subtitle = "Quartos com fotos reais, reviews e sinais de confiança para você comparar rápido.",
  title = "Listagens em destaque",
}: FeaturedListingCarouselProps) {
  return (
    <section className="uai-section bg-background">
      <div className="uai-container grid gap-6">
        <SectionHeader
          action={
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
              href="/buscar"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
          eyebrow="Escolhas rápidas"
          subtitle={subtitle}
          title={title}
        />
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {listings.map((listing) => (
            <div className="w-[82vw] shrink-0 snap-start sm:w-auto" key={listing.id}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
