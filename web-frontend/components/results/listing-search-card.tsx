import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatShortDate } from "@/lib/formatters";
import type { ListingSearchResult, ListingTrustBadge } from "@/lib/types";
import { CompatibilityPillGroup } from "./compatibility-pill-group";
import { PriceSummaryPill } from "./price-summary-pill";

const roomTypeLabel: Record<ListingSearchResult["room"]["type"], string> = {
  private: "individual",
  shared: "compartilhado",
  suite: "suíte",
};

const trustLabel: Record<ListingTrustBadge, string> = {
  bill_split: "contas claras",
  contract_ready: "contrato pronto",
  student_friendly: "perfil estudantil",
  verified_owner: "verificado",
};

export function ListingSearchCard({
  listing,
}: {
  listing: ListingSearchResult;
}) {
  return (
    <article className="overflow-hidden rounded-md border border-border bg-surface shadow-xs transition duration-150 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="grid gap-0 md:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="relative min-h-56 bg-surface-muted md:min-h-full">
          <Image
            alt={listing.title}
            className="object-cover"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 240px, 100vw"
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1 text-sm font-bold text-brand">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {listing.location.commuteMinutes} min até{" "}
                {listing.location.campusLabel}
              </p>
              <p className="inline-flex items-center gap-1 text-sm font-bold text-accent">
                <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                {listing.rating.toFixed(1)}
                <span className="font-medium text-muted">
                  ({listing.reviewCount})
                </span>
              </p>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">
              {listing.title}
            </h2>
            <p className="text-sm text-muted">
              {listing.location.neighborhood}, {listing.location.city}
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="grid gap-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <InfoLine
                  icon={<Home className="h-4 w-4" aria-hidden="true" />}
                  label={roomTypeLabel[listing.room.type]}
                />
                <InfoLine
                  icon={<ReceiptText className="h-4 w-4" aria-hidden="true" />}
                  label={
                    listing.pricing.billsIncluded
                      ? "contas inclusas"
                      : "contas a combinar"
                  }
                />
                <InfoLine
                  icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
                  label={`entra ${formatShortDate(listing.availability.availableFrom)}`}
                />
                <InfoLine
                  icon={<Clock3 className="h-4 w-4" aria-hidden="true" />}
                  label={listing.responseTimeLabel}
                />
              </div>
              <CompatibilityPillGroup profile={listing.roommateProfile} />
            </div>

            <PriceSummaryPill pricing={listing.pricing} />
          </div>

          <div className="grid gap-2 border-t border-border pt-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
              Depósito/caução: {formatCurrency(listing.pricing.deposit.amount)}
            </p>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
              href={`/anuncio/${listing.slug}`}
            >
              Ver detalhes
            </Link>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
              type="button"
            >
              <Bookmark className="h-4 w-4" aria-hidden="true" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoLine({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-surface-muted px-3 py-2 text-sm font-bold text-muted-strong">
      <span className="text-brand">{icon}</span>
      {label}
    </span>
  );
}
