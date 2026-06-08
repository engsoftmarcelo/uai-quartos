"use client";

import dynamic from "next/dynamic";
import type { ListingSearchResult, ResultsViewMode } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const MapView = dynamic(
  () => import("./map-view").then((module) => module.MapView),
  {
    loading: () => <Skeleton className="min-h-[32rem] w-full" />,
    ssr: false,
  },
);

export function SearchMapPanel({
  listings,
  view,
}: {
  listings: ListingSearchResult[];
  view: ResultsViewMode;
}) {
  return (
    <aside
      className={cn(
        "lg:sticky lg:top-24 lg:block",
        view === "map" ? "block" : "hidden",
      )}
    >
      <MapView listings={listings} />
    </aside>
  );
}
