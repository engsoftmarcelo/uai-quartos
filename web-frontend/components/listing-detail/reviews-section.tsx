"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import type { ListingDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ReviewsSection({ listing }: { listing: ListingDetail }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const review of listing.reviews) {
      for (const tag of review.tags) tags.add(tag);
    }
    return [...tags];
  }, [listing.reviews]);

  const visibleReviews = activeTag
    ? listing.reviews.filter((review) => review.tags.includes(activeTag))
    : listing.reviews;

  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-1">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">
          reviews de quem morou
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          O que outros estudantes perceberam
        </h2>
        <p className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong">
          <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
          {listing.rating.toFixed(1)} de 5 · {listing.reviewCount} reviews
        </p>
      </div>

      {allTags.length ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar reviews por tema">
          <TagChip
            active={activeTag === null}
            label="Todos"
            onClick={() => setActiveTag(null)}
          />
          {allTags.map((tag) => (
            <TagChip
              active={activeTag === tag}
              key={tag}
              label={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {visibleReviews.map((review) => (
          <figure
            className="grid content-start gap-3 rounded-md border border-border bg-surface-raised p-3"
            key={review.id}
          >
            <div className="flex items-center justify-between gap-2">
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
              <span className="text-xs text-muted">{review.dateLabel}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {review.tags.map((tag) => (
                <button
                  className="rounded-md bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand-strong transition hover:bg-brand hover:text-white"
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
            <blockquote className="text-sm leading-6 text-muted-strong">
              {review.quote}
            </blockquote>
            <figcaption className="text-sm text-muted">
              <span className="font-bold text-foreground">{review.author}</span>{" "}
              · {review.stayContext}
            </figcaption>
          </figure>
        ))}
      </div>

      {visibleReviews.length === 0 ? (
        <p className="rounded-md bg-surface-muted p-3 text-sm text-muted">
          Nenhum review com esse tema ainda. Limpe o filtro para ver todos.
        </p>
      ) : null}
    </section>
  );
}

function TagChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center rounded-md border px-3 text-sm font-bold transition",
        active
          ? "border-brand bg-brand text-white"
          : "border-border bg-surface text-muted-strong hover:bg-surface-muted",
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
