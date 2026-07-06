import Image from "next/image";
import Link from "next/link";
import { Bath, CheckCircle2, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatShortDate } from "@/lib/formatters";
import type { ListingPreview, ListingTrustBadge } from "@/lib/types";

const trustLabel: Record<ListingTrustBadge, string> = {
  bill_split: "contas claras",
  contract_ready: "contrato pronto",
  student_friendly: "perfil estudantil",
  verified_owner: "dono validado",
};

const roomTypeLabel: Record<ListingPreview["roomType"], string> = {
  private: "individual",
  shared: "partilhado",
  suite: "suíte",
};

export function ListingCard({ listing }: { listing: ListingPreview }) {
  return (
    <article className="overflow-hidden rounded-md border border-border bg-surface shadow-xs transition duration-150 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="relative aspect-[4/3] bg-surface-muted">
        <Image
          alt={listing.title}
          className="object-cover"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          src={listing.imageUrl}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {listing.trustBadges.slice(0, 2).map((badge) => (
            <Badge
              icon={<ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />}
              key={badge}
              tone="brand"
            >
              {trustLabel[badge]}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <p className="inline-flex items-center gap-1 text-sm font-bold text-accent">
              <Star className="h-4 w-4 fill-current" aria-hidden="true" />
              {listing.rating.toFixed(1)}
              <span className="font-medium text-muted">
                ({listing.reviewCount})
              </span>
            </p>
            <Badge tone="signal">{roomTypeLabel[listing.roomType]}</Badge>
          </div>
          <h3 className="line-clamp-2 font-display text-xl font-bold text-foreground">
            {listing.title}
          </h3>
          <p className="inline-flex items-center gap-1 text-sm text-muted">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {listing.location.neighborhood}, {listing.location.city}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="inline-flex items-center gap-1 text-muted-strong">
            <Users className="h-4 w-4 text-brand" aria-hidden="true" />
            {listing.capacity} pessoa{listing.capacity > 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1 text-muted-strong">
            <Bath className="h-4 w-4 text-brand" aria-hidden="true" />
            desde {formatShortDate(listing.availableFrom)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {listing.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity.id}>{amenity.label}</Badge>
          ))}
        </div>

        {listing.matchHighlights.length ? (
          <ul className="grid gap-1 text-sm text-muted">
            {listing.matchHighlights.slice(0, 3).map((highlight) => (
              <li className="inline-flex items-center gap-2" key={highlight}>
                <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
          <p className="text-sm text-muted">Aluguel estimado</p>
          <p className="text-right">
            <span className="font-display text-2xl font-bold text-foreground">
              {formatCurrency(listing.price.amount)}
            </span>
            <span className="text-sm text-muted">/mês</span>
          </p>
        </div>

        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href={`/buscar?location=${encodeURIComponent(listing.location.neighborhood)}`}
        >
          Ver detalhes seguros
        </Link>
      </div>
    </article>
  );
}
