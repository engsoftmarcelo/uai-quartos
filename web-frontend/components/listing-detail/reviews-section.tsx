import { Star } from "lucide-react";
import type { ListingDetail } from "@/lib/types";

export function ReviewsSection({ listing }: { listing: ListingDetail }) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-1">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">
          reviews autenticos
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          O que outros estudantes perceberam
        </h2>
        <p className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong">
          <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
          {listing.rating.toFixed(1)} de 5 · {listing.reviewCount} reviews
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {listing.reviews.map((review) => (
          <figure
            className="grid gap-3 rounded-md border border-border bg-surface-raised p-3"
            key={review.id}
          >
            <div className="flex items-center gap-1 text-accent">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  aria-hidden="true"
                  className="h-4 w-4 fill-current"
                  key={index}
                  opacity={index + 1 <= review.rating ? 1 : 0.35}
                />
              ))}
            </div>
            <blockquote className="text-sm leading-6 text-muted-strong">
              {review.quote}
            </blockquote>
            <figcaption className="text-sm text-muted">
              <span className="font-bold text-foreground">{review.author}</span>{" "}
              - {review.dateLabel} - {review.stayContext}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
