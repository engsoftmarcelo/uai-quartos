import {
  BadgeCheck,
  Bath,
  BedSingle,
  CalendarDays,
  Clock3,
  Home,
  MapPin,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatShortDate } from "@/lib/formatters";
import type { ListingDetail } from "@/lib/types";

const roomTypeLabel: Record<ListingDetail["room"]["type"], string> = {
  private: "quarto individual",
  shared: "quarto compartilhado",
  suite: "suite",
};

export function ListingQuickFacts({ listing }: { listing: ListingDetail }) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-2">
        <div className="flex flex-wrap gap-2">
          {listing.trustBadges.includes("verified_owner") ? (
            <Badge
              icon={<BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />}
              tone="success"
            >
              locador verificado
            </Badge>
          ) : null}
          <Badge tone="brand">{roomTypeLabel[listing.room.type]}</Badge>
          <Badge tone="accent">{listing.location.commuteMinutes} min do campus</Badge>
        </div>
        <h1 className="font-display text-3xl font-bold text-balance text-foreground sm:text-4xl">
          {listing.title}
        </h1>
        <p className="text-pretty text-base leading-7 text-muted">
          {listing.summary}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Fact
          icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
          label="Onde fica"
          value={`${listing.location.neighborhood}, ${listing.location.city}`}
        />
        <Fact
          icon={<Home className="h-4 w-4" aria-hidden="true" />}
          label="Custo mensal"
          value={formatCurrency(listing.pricing.monthlyTotal.amount)}
        />
        <Fact
          icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
          label="Disponivel"
          value={formatShortDate(listing.availability.availableFrom)}
        />
        <Fact
          icon={<BedSingle className="h-4 w-4" aria-hidden="true" />}
          label="Quarto"
          value={`${listing.room.areaM2} m2, ${listing.room.bedLabel}`}
        />
        <Fact
          icon={<Bath className="h-4 w-4" aria-hidden="true" />}
          label="Banheiro"
          value={listing.room.privateBathroom ? "privativo" : "compartilhado"}
        />
        <Fact
          icon={<Clock3 className="h-4 w-4" aria-hidden="true" />}
          label="Resposta"
          value={listing.host.responseTimeLabel}
        />
      </div>

      <p className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong">
        <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
        {listing.rating.toFixed(1)} de 5 · {listing.reviewCount} reviews
      </p>
    </section>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 rounded-md bg-surface-muted px-3 py-2">
      <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-muted">
        <span className="text-brand">{icon}</span>
        {label}
      </p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
