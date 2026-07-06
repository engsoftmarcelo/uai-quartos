"use client";

import { useMemo, useState } from "react";
import { Building2, Layers, MapPin } from "lucide-react";
import type { ListingCoordinates, ListingSearchResult, MapCluster } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface MapProviderAdapter {
  cluster(listings: ListingSearchResult[]): MapCluster[];
  project(position: ListingCoordinates): { x: number; y: number };
}

const bounds = {
  maxLat: -19.86,
  maxLng: -43.9,
  minLat: -19.96,
  minLng: -44.02,
};

const staticMapAdapter: MapProviderAdapter = {
  cluster(listings) {
    const groups = new Map<string, ListingSearchResult[]>();

    listings.forEach((listing) => {
      const projected = staticMapAdapter.project(listing.location.coordinates);
      const key = `${Math.round(projected.x / 14)}-${Math.round(projected.y / 14)}`;
      groups.set(key, [...(groups.get(key) ?? []), listing]);
    });

    return Array.from(groups.entries()).map(([id, group]) => {
      const avg = group.reduce(
        (sum, listing) => ({
          lat: sum.lat + listing.location.coordinates.lat,
          lng: sum.lng + listing.location.coordinates.lng,
        }),
        { lat: 0, lng: 0 },
      );

      return {
        count: group.length,
        id,
        listings: group,
        position: {
          lat: avg.lat / group.length,
          lng: avg.lng / group.length,
        },
      };
    });
  },
  project(position) {
    const x =
      ((position.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y =
      100 -
      ((position.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;

    return {
      x: clamp(x, 8, 92),
      y: clamp(y, 10, 88),
    };
  },
};

export function MapView({ listings }: { listings: ListingSearchResult[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(listings[0]?.id ?? null);
  const clusters = useMemo(() => staticMapAdapter.cluster(listings), [listings]);
  const selected =
    listings.find((listing) => listing.id === selectedId) ??
    clusters[0]?.listings[0];

  return (
    <section
      aria-label="Mapa de resultados"
      className="relative min-h-[32rem] overflow-hidden rounded-md border border-border bg-[#dfe9df] shadow-xs"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(35,118,93,0.10)_1px,transparent_1px),linear-gradient(0deg,rgba(35,118,93,0.10)_1px,transparent_1px)] bg-[length:36px_36px]" />
      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-md bg-surface/95 px-3 py-2 text-sm font-bold text-muted-strong shadow-xs">
        <Layers className="h-4 w-4 text-brand" aria-hidden="true" />
        Mapa adapter-ready
      </div>

      {clusters.map((cluster) => {
        const position = staticMapAdapter.project(cluster.position);
        const primary = cluster.listings[0];
        const isSelected = cluster.listings.some((listing) => listing.id === selected?.id);

        return (
          <button
            aria-label={`${cluster.count} resultado em ${primary.location.neighborhood}`}
            className={cn(
              "absolute z-10 grid min-h-12 min-w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md border-2 border-white bg-brand px-3 text-sm font-bold text-white shadow-md transition hover:scale-105",
              isSelected && "bg-foreground",
            )}
            key={cluster.id}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            type="button"
            onClick={() => setSelectedId(primary.id)}
          >
            {cluster.count > 1 ? cluster.count : formatCurrency(primary.pricing.totalMonthly.amount)}
          </button>
        );
      })}

      {selected ? (
        <article className="absolute inset-x-3 bottom-3 z-20 grid gap-2 rounded-md border border-border bg-surface p-3 shadow-md">
          <p className="inline-flex items-center gap-1 text-sm font-bold text-brand">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {selected.location.commuteMinutes} min até {selected.location.campusLabel}
          </p>
          <h2 className="font-display text-lg font-bold text-foreground">
            {selected.title}
          </h2>
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <Building2 className="h-4 w-4 text-brand" aria-hidden="true" />
            {selected.location.neighborhood} ·{" "}
            {formatCurrency(selected.pricing.totalMonthly.amount)}/mês
          </p>
        </article>
      ) : null}
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
