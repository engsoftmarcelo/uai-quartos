import type { Metadata } from "next";
import { PopularFilterChips } from "@/components/search/popular-filter-chips";
import { RecentSearches } from "@/components/search/recent-searches";
import { SearchResultsSection } from "@/components/search/search-results-section";
import { SearchStarterPanel } from "@/components/search/search-starter-panel";
import { createListingsAdapter } from "@/lib/adapters";
import {
  getActiveShortcutIds,
  getSearchCopy,
  parseSearchParams,
  toListingFilters,
} from "@/lib/utils";

type RawSearchParams = Record<string, string | string[] | undefined>;

interface SearchPageProps {
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = parseSearchParams(await searchParams);
  const location = query.location?.trim();
  const title = location
    ? `Quartos e repúblicas perto de ${location}`
    : "Buscar quartos e repúblicas";

  return {
    title,
    description:
      "Busca de moradia universitária com filtros por campus, bairro, orçamento, tipo de quarto, data de entrada e sinais de confiança.",
    alternates: {
      canonical: "/buscar",
    },
    openGraph: {
      title: `${title} | UAI QUARTOS`,
      description:
        "Compare preço, distância, reviews e custos transparentes antes de chamar no contato.",
      url: "/buscar",
      type: "website",
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = parseSearchParams(await searchParams);
  const adapter = createListingsAdapter();
  const listings = await adapter.search(toListingFilters(query));

  return (
    <div className="uai-section bg-background">
      <div className="uai-container grid gap-6">
        <SearchStarterPanel values={query} />

        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <aside className="grid gap-5 lg:sticky lg:top-24">
            <PopularFilterChips activeIds={getActiveShortcutIds(query)} />
            <RecentSearches />
          </aside>

          <SearchResultsSection copy={getSearchCopy(query)} listings={listings} />
        </div>
      </div>
    </div>
  );
}
