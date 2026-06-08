import type { ListingFilters, ListingPreview, SearchFormValues } from "@/lib/types";

export interface SearchPageQuery extends SearchFormValues {
  billsIncluded?: boolean;
  nearCampus?: boolean;
  quiet?: boolean;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseSearchParams(params: RawSearchParams): SearchPageQuery {
  const roomType = first(params.roomType);

  return {
    billsIncluded: parseBoolean(params.billsIncluded),
    budget: first(params.budget),
    location: first(params.location),
    moveIn: first(params.moveIn),
    nearCampus: parseBoolean(params.nearCampus),
    quiet: parseBoolean(params.quiet),
    roomType: isRoomType(roomType) ? roomType : undefined,
  };
}

export function toListingFilters(query: SearchPageQuery): ListingFilters {
  const maxPrice = query.budget ? Number(query.budget) : undefined;

  return {
    billsIncluded: query.billsIncluded,
    location: query.location,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    moveIn: query.moveIn,
    nearCampus: query.nearCampus,
    quiet: query.quiet,
    roomType: isRoomType(query.roomType) ? query.roomType : undefined,
  };
}

export function getActiveShortcutIds(query: SearchPageQuery) {
  const active: string[] = [];

  if (query.nearCampus) active.push("near-campus");
  if (query.billsIncluded) active.push("bills");
  if (query.roomType === "shared") active.push("shared");
  if (query.quiet) active.push("quiet");

  return active;
}

export function getSearchCopy(query: SearchPageQuery) {
  const parts: string[] = [];

  if (query.location) parts.push(`perto de ${query.location}`);
  if (query.budget) parts.push(`ate R$ ${query.budget}`);
  if (query.roomType === "private") parts.push("quarto individual");
  if (query.roomType === "shared") parts.push("quarto compartilhado");
  if (query.roomType === "suite") parts.push("suite");
  if (query.nearCampus) parts.push("perto do campus");
  if (query.billsIncluded) parts.push("com contas inclusas");
  if (query.quiet) parts.push("ambiente silencioso");

  if (!parts.length) {
    return "Comece com campus, bairro ou orcamento. Os resultados usam mocks tipados enquanto os adapters ficam prontos para as APIs existentes.";
  }

  return `Busca refinada para ${parts.join(", ")}. Compare distancia, preco e confianca antes de chamar no contato.`;
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseBoolean(value: string | string[] | undefined) {
  return first(value) === "true";
}

function isRoomType(value?: string): value is ListingPreview["roomType"] {
  return value === "private" || value === "shared" || value === "suite";
}
