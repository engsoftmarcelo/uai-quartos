import { Star } from "lucide-react";
import type { LandlordReview } from "@/lib/types";

export function ReviewManagementPanel({
  reviews,
}: {
  reviews: LandlordReview[];
}) {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Reviews recentes
        </h2>
        <p className="mt-1 text-sm text-muted">
          Reputacao distribuida por anuncio e visivel para melhoria continua.
        </p>
      </div>

      <div className="grid gap-2">
        {reviews.map((review) => (
          <article
            className="grid gap-2 rounded-md border border-border bg-surface-raised p-3"
            key={review.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-muted-strong">{review.authorName}</p>
                <p className="text-sm text-muted">{review.listingTitle}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-accent">
                <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                {review.rating}
              </span>
            </div>
            <p className="text-sm leading-6 text-muted">{review.body}</p>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
              {review.receivedAtLabel}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
