import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, Heart, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import type { StudentSavedListing } from "@/lib/types";

export function SavedListingCard({ listing }: { listing: StudentSavedListing }) {
  return (
    <article className="overflow-hidden rounded-md border border-border bg-surface shadow-xs">
      <div className="relative aspect-[4/3] bg-surface-muted">
        <Image
          alt={listing.title}
          className="object-cover"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 320px, 100vw"
          src={listing.imageUrl}
        />
        <span className="absolute left-3 top-3 inline-flex h-8 items-center gap-1 rounded-md bg-surface/95 px-2 text-xs font-bold text-brand shadow-xs">
          <Heart className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          {listing.matchScore}% match
        </span>
      </div>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-sm font-bold text-brand">{listing.campusLabel}</p>
          <h3 className="mt-1 font-display text-lg font-bold text-foreground">
            {listing.title}
          </h3>
          <p className="mt-1 text-sm text-muted">{listing.neighborhood}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {listing.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="grid gap-2 rounded-md bg-surface-muted p-3">
          <p className="font-display text-2xl font-bold text-foreground">
            {formatCurrency(listing.totalMonthly.amount)}
            <span className="text-sm font-medium text-muted">/mês</span>
          </p>
          <p className="text-sm text-muted">
            Hoje: {formatCurrency(listing.dueToday.amount)} - {listing.savedAtLabel}
          </p>
        </div>
        {listing.changes.length ? (
          <div className="grid gap-1">
            {listing.changes.map((change) => (
              <p
                className="inline-flex items-center gap-2 text-sm font-medium text-success"
                key={change}
              >
                {change.includes("preço") ? (
                  <TrendingDown className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Bell className="h-4 w-4" aria-hidden="true" />
                )}
                {change}
              </p>
            ))}
          </div>
        ) : null}
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href={`/anuncio/${listing.slug}`}
        >
          Ver detalhes
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
