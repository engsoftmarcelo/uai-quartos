import { Clock3, MapPin, Route } from "lucide-react";
import type { ListingCoordinates, ListingDetail } from "@/lib/types";

const bounds = {
  maxLat: -19.86,
  maxLng: -43.9,
  minLat: -19.96,
  minLng: -44.02,
};

export function NeighborhoodAndCampusCard({
  listing,
}: {
  listing: ListingDetail;
}) {
  const home = project(listing.location.coordinates);
  const campus = project(listing.campus.coordinates);

  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-1">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          bairro e campus
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Onde fica e como chegar
        </h2>
        <p className="text-sm leading-6 text-muted">
          Endereço aproximado: {listing.location.addressHint}. A referência
          exata deve ser confirmada no contato seguro.
        </p>
      </div>

      <div className="relative min-h-72 overflow-hidden rounded-md border border-border bg-[#dfe9df]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(35,118,93,0.10)_1px,transparent_1px),linear-gradient(0deg,rgba(35,118,93,0.10)_1px,transparent_1px)] bg-[length:34px_34px]" />
        <Marker
          label="República"
          left={home.x}
          tone="home"
          top={home.y}
        />
        <Marker
          label={listing.campus.label}
          left={campus.x}
          tone="campus"
          top={campus.y}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <p className="inline-flex items-center gap-2 rounded-md bg-surface-muted px-3 py-2 text-sm font-bold text-muted-strong">
          <Clock3 className="h-4 w-4 text-brand" aria-hidden="true" />
          {listing.location.commuteMinutes} min até {listing.campus.label}
        </p>
        <p className="inline-flex items-center gap-2 rounded-md bg-surface-muted px-3 py-2 text-sm font-bold text-muted-strong">
          <Route className="h-4 w-4 text-brand" aria-hidden="true" />
          {listing.campus.distanceKm} km estimados
        </p>
      </div>
    </section>
  );
}

function Marker({
  label,
  left,
  tone,
  top,
}: {
  label: string;
  left: number;
  tone: "campus" | "home";
  top: number;
}) {
  return (
    <div
      className="absolute z-10 grid -translate-x-1/2 -translate-y-1/2 gap-1 text-center"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <span
        className={
          tone === "home"
            ? "grid h-12 w-12 place-items-center rounded-md border-2 border-white bg-brand text-white shadow-md"
            : "grid h-12 w-12 place-items-center rounded-md border-2 border-white bg-foreground text-white shadow-md"
        }
      >
        <MapPin className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="rounded-md bg-surface/95 px-2 py-1 text-xs font-bold text-muted-strong shadow-xs">
        {label}
      </span>
    </div>
  );
}

function project(position: ListingCoordinates) {
  const x =
    ((position.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y =
    100 -
    ((position.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;

  return {
    x: clamp(x, 10, 90),
    y: clamp(y, 12, 88),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
