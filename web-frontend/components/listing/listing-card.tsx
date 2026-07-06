import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import type { ListingPreview, ListingTrustBadge } from "@/lib/types";

const trustLabel: Record<ListingTrustBadge, string> = {
  bill_split: "contas claras",
  contract_ready: "contrato pronto",
  student_friendly: "perfil estudantil",
  verified_owner: "Dono verificado",
};

const roomTypeLabel: Record<ListingPreview["roomType"], string> = {
  private: "individual",
  shared: "compartilhado",
  suite: "suíte",
};

export function ListingCard({ listing }: { listing: ListingPreview }) {
  const campusHighlight = listing.location.distanceToCampusInMinutes;

  return (
    <article className="overflow-hidden rounded-md border border-border bg-surface shadow-xs transition duration-150 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="relative aspect-[16/10] bg-surface-muted">
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
        {typeof listing.compatibilityScore === "number" ? (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-foreground/85 px-2.5 py-1.5 text-xs font-bold text-white backdrop-blur">
            <HeartHandshake className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Match {listing.compatibilityScore}% com você
          </div>
        ) : null}
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
          <p className="inline-flex items-center gap-1 text-sm font-bold text-brand">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {campusHighlight
              ? `${campusHighlight} min até o campus · ${listing.location.neighborhood}`
              : `${listing.location.neighborhood}, ${listing.location.city}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge icon={<Users className="h-3.5 w-3.5" aria-hidden="true" />}>
            {listing.capacity} pessoa{listing.capacity > 1 ? "s" : ""}
          </Badge>
          {listing.amenities.slice(0, 2).map((amenity) => (
            <Badge key={amenity.id}>{amenity.label}</Badge>
          ))}
        </div>

        {listing.matchHighlights.length ? (
          <ul className="grid gap-1 text-sm text-muted">
            {listing.matchHighlights.slice(0, 2).map((highlight) => (
              <li className="inline-flex items-center gap-2" key={highlight}>
                <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
          <div className="grid gap-1">
            <p className="text-sm text-muted">Total por mês</p>
            {listing.billsIncluded ? (
              <span className="inline-flex w-fit items-center rounded-md bg-success-soft px-2 py-0.5 text-xs font-bold text-success">
                contas incluídas
              </span>
            ) : (
              <span className="inline-flex w-fit items-center rounded-md bg-surface-muted px-2 py-0.5 text-xs font-bold text-muted">
                contas à parte
              </span>
            )}
          </div>
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
