import type { Metadata } from "next";
import { ActiveFiltersBar } from "@/components/results/active-filters-bar";
import { DesktopFiltersSidebar } from "@/components/results/desktop-filters-sidebar";
import { FilterDrawer } from "@/components/results/filter-drawer";
import { ListingResultsGrid } from "@/components/results/listing-results-grid";
import { MobileMapToggle } from "@/components/results/mobile-map-toggle";
import { PromotedFilterChips } from "@/components/results/promoted-filter-chips";
import { ResultsPageHeader } from "@/components/results/results-page-header";
import { ResultsSort } from "@/components/results/results-sort";
import { ResultsStats } from "@/components/results/results-stats";
import { SavedSearchCTA } from "@/components/results/saved-search-cta";
import { SearchMapPanel } from "@/components/results/search-map-panel";
import { createResultsAdapter } from "@/lib/adapters";
import { parseResultsSearchParams } from "@/lib/utils";

type RawSearchParams = Record<string, string | string[] | undefined>;

interface ResultsPageProps {
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({
  searchParams,
}: ResultsPageProps): Promise<Metadata> {
  const filters = parseResultsSearchParams(await searchParams);
  const place = filters.location ?? filters.campus;
  const title = place
    ? `Resultados de moradia perto de ${place}`
    : "Resultados de moradia universitária";

  return {
    title,
    description:
      "Explore moradias universitárias com mapa, filtros avancados, custo total, valor a pagar hoje e compatibilidade de convivência.",
    alternates: {
      canonical: "/buscar/resultados",
    },
    openGraph: {
      title: `${title} | UAI QUARTOS`,
      description:
        "Resultados compartilhaveis por URL com lista performatica, mapa e filtros de confiança.",
      type: "website",
      url: "/buscar/resultados",
    },
  };
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const filters = parseResultsSearchParams(await searchParams);
  const adapter = createResultsAdapter();
  const results = await adapter.search(filters);
  const averageCommute = results.listings.length
    ? Math.round(
        results.listings.reduce(
          (sum, listing) => sum + listing.location.commuteMinutes,
          0,
        ) / results.listings.length,
      )
    : 0;
  const verifiedCount = results.listings.filter((listing) =>
    listing.trustBadges.includes("verified_owner"),
  ).length;

  return (
    <div className="bg-background py-5 sm:py-6">
      <div className="mx-auto grid w-full max-w-[96rem] gap-5 px-4 sm:px-6">
        <ResultsPageHeader filters={filters} />
        <ActiveFiltersBar activeFilters={results.activeFilters} />
        <PromotedFilterChips filters={filters} />

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
          <ResultsStats
            averageCommute={averageCommute}
            totalCount={results.totalCount}
            verifiedCount={verifiedCount}
          />
          <FilterDrawer filters={filters} />
          <ResultsSort value={filters.sort} />
        </div>

        <MobileMapToggle value={filters.view} />

        <div className="grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)_minmax(23rem,0.82fr)] lg:items-start">
          <DesktopFiltersSidebar filters={filters} />

          <main
            className={filters.view === "map" ? "hidden lg:grid" : "grid"}
            id="resultados-lista"
          >
            <div className="grid gap-4">
              <SavedSearchCTA />
              <ListingResultsGrid listings={results.listings} />
            </div>
          </main>

          <SearchMapPanel listings={results.listings} view={filters.view} />
        </div>
      </div>
    </div>
  );
}
