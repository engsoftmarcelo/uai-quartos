import type {
  ActiveFilter,
  GenderPolicy,
  GuestPolicy,
  NoisePolicy,
  PetPolicy,
  ResultsSortKey,
  ResultsViewMode,
  RoomType,
  SearchResultFilters,
  SmokerPolicy,
} from "@/lib/types";

type RawSearchParams = Record<string, string | string[] | undefined>;
type FilterPatch = Partial<SearchResultFilters>;

const defaults = {
  sort: "recommended",
  view: "list",
} as const;

const roomTypes: RoomType[] = ["private", "shared", "suite"];
const sorts: ResultsSortKey[] = [
  "recommended",
  "price_asc",
  "commute_asc",
  "due_today_asc",
  "rating_desc",
];
const views: ResultsViewMode[] = ["list", "map"];
const genderPolicies: GenderPolicy[] = [
  "all_genders",
  "mixed",
  "women_only",
  "men_only",
];
const guestPolicies: GuestPolicy[] = ["allowed", "limited", "not_allowed"];
const noisePolicies: NoisePolicy[] = ["quiet", "balanced", "lively"];
const petPolicies: PetPolicy[] = ["allowed", "not_allowed"];
const smokerPolicies: SmokerPolicy[] = [
  "allowed",
  "outside_only",
  "not_allowed",
];

const labelMaps = {
  genderPolicy: {
    all_genders: "todos os generos",
    men_only: "casa masculina",
    mixed: "casa mista",
    women_only: "casa feminina",
  },
  guests: {
    allowed: "hospedes permitidos",
    limited: "hospedes combinados",
    not_allowed: "sem hospedes",
  },
  noise: {
    balanced: "ruido moderado",
    lively: "casa movimentada",
    quiet: "ambiente silencioso",
  },
  pets: {
    allowed: "pets permitidos",
    not_allowed: "sem pets",
  },
  roomType: {
    private: "quarto individual",
    shared: "quarto compartilhado",
    suite: "suite",
  },
  smoker: {
    allowed: "fumante ok",
    not_allowed: "nao fumante",
    outside_only: "fumante so fora",
  },
} as const;

export function parseResultsSearchParams(
  params: RawSearchParams,
): SearchResultFilters {
  const roomType = first(params.roomType);
  const sort = first(params.sort);
  const view = first(params.view);
  const genderPolicy = first(params.genderPolicy);
  const guests = first(params.guests);
  const noise = first(params.noise);
  const pets = first(params.pets);
  const smoker = first(params.smoker);

  return {
    availability: first(params.availability) ?? first(params.moveIn),
    billsIncluded: parseBoolean(params.billsIncluded),
    campus: first(params.campus),
    compatibility: parseList(params.compat),
    commuteMax: parseNumber(params.commuteMax),
    dueTodayMax: parseNumber(params.dueTodayMax),
    furnished: parseBoolean(params.furnished),
    genderPolicy: includes(genderPolicies, genderPolicy)
      ? genderPolicy
      : undefined,
    guests: includes(guestPolicies, guests) ? guests : undefined,
    houseRules: parseList(params.houseRules),
    location: first(params.location),
    minStayMax: parseNumber(params.minStayMax),
    noise: includes(noisePolicies, noise) ? noise : undefined,
    pets: includes(petPolicies, pets) ? pets : undefined,
    roomType: includes(roomTypes, roomType) ? roomType : undefined,
    smoker: includes(smokerPolicies, smoker) ? smoker : undefined,
    sort: includes(sorts, sort) ? sort : defaults.sort,
    study: parseBoolean(params.study),
    totalMax: parseNumber(params.totalMax ?? params.budget),
    verified: parseBoolean(params.verified),
    view: includes(views, view) ? view : defaults.view,
  };
}

export function buildResultsHref(
  filters: SearchResultFilters,
  patch: FilterPatch,
) {
  const next = normalizeFilters({ ...filters, ...patch });
  const params = toResultsSearchParams(next);
  const query = params.toString();

  return query ? `/buscar/resultados?${query}` : "/buscar/resultados";
}

export function toResultsSearchParams(filters: SearchResultFilters) {
  const params = new URLSearchParams();

  set(params, "availability", filters.availability);
  set(params, "billsIncluded", filters.billsIncluded);
  set(params, "campus", filters.campus);
  set(params, "commuteMax", filters.commuteMax);
  set(params, "compat", filters.compatibility.join(","));
  set(params, "dueTodayMax", filters.dueTodayMax);
  set(params, "furnished", filters.furnished);
  set(params, "genderPolicy", filters.genderPolicy);
  set(params, "guests", filters.guests);
  set(params, "houseRules", filters.houseRules.join(","));
  set(params, "location", filters.location);
  set(params, "minStayMax", filters.minStayMax);
  set(params, "noise", filters.noise);
  set(params, "pets", filters.pets);
  set(params, "roomType", filters.roomType);
  set(params, "smoker", filters.smoker);
  set(params, "sort", filters.sort === defaults.sort ? undefined : filters.sort);
  set(params, "study", filters.study);
  set(params, "totalMax", filters.totalMax);
  set(params, "verified", filters.verified);
  set(params, "view", filters.view === defaults.view ? undefined : filters.view);

  return params;
}

export function getActiveResultFilters(
  filters: SearchResultFilters,
): ActiveFilter[] {
  const active: ActiveFilter[] = [];
  const push = (
    key: keyof SearchResultFilters,
    label: string,
    patch: FilterPatch,
  ) => active.push({ href: buildResultsHref(filters, patch), key, label });

  if (filters.location) {
    push("location", filters.location, { location: undefined });
  }
  if (filters.campus) {
    push("campus", filters.campus, { campus: undefined });
  }
  if (filters.totalMax) {
    push("totalMax", `ate R$ ${filters.totalMax}/mes`, { totalMax: undefined });
  }
  if (filters.dueTodayMax) {
    push("dueTodayMax", `hoje ate R$ ${filters.dueTodayMax}`, {
      dueTodayMax: undefined,
    });
  }
  if (filters.billsIncluded) {
    push("billsIncluded", "contas inclusas", { billsIncluded: undefined });
  }
  if (filters.roomType) {
    push("roomType", labelMaps.roomType[filters.roomType], {
      roomType: undefined,
    });
  }
  if (filters.availability) {
    push("availability", `entrada ate ${filters.availability}`, {
      availability: undefined,
    });
  }
  if (filters.genderPolicy) {
    push("genderPolicy", labelMaps.genderPolicy[filters.genderPolicy], {
      genderPolicy: undefined,
    });
  }
  if (filters.pets) {
    push("pets", labelMaps.pets[filters.pets], { pets: undefined });
  }
  if (filters.smoker) {
    push("smoker", labelMaps.smoker[filters.smoker], { smoker: undefined });
  }
  if (filters.noise) {
    push("noise", labelMaps.noise[filters.noise], { noise: undefined });
  }
  if (filters.study) {
    push("study", "favoravel a estudos", { study: undefined });
  }
  if (filters.guests) {
    push("guests", labelMaps.guests[filters.guests], { guests: undefined });
  }
  if (filters.furnished) {
    push("furnished", "mobiliado", { furnished: undefined });
  }
  if (filters.minStayMax) {
    push("minStayMax", `minimo ate ${filters.minStayMax} meses`, {
      minStayMax: undefined,
    });
  }
  if (filters.commuteMax) {
    push("commuteMax", `ate ${filters.commuteMax} min do campus`, {
      commuteMax: undefined,
    });
  }
  if (filters.verified) {
    push("verified", "dono verificado", { verified: undefined });
  }

  filters.compatibility.forEach((item) => {
    active.push({
      href: buildResultsHref(filters, {
        compatibility: filters.compatibility.filter((value) => value !== item),
      }),
      key: `compat-${item}`,
      label: item,
    });
  });

  filters.houseRules.forEach((item) => {
    active.push({
      href: buildResultsHref(filters, {
        houseRules: filters.houseRules.filter((value) => value !== item),
      }),
      key: `rule-${item}`,
      label: item,
    });
  });

  return active;
}

export function isPromotedFilterActive(
  filters: SearchResultFilters,
  id: string,
) {
  if (id === "commute") return Boolean(filters.commuteMax && filters.commuteMax <= 10);
  if (id === "bills") return Boolean(filters.billsIncluded);
  if (id === "study") return Boolean(filters.study || filters.noise === "quiet");
  if (id === "furnished") return Boolean(filters.furnished);
  if (id === "due-today") {
    return Boolean(filters.dueTodayMax && filters.dueTodayMax <= 700);
  }

  return false;
}

function normalizeFilters(filters: SearchResultFilters): SearchResultFilters {
  return {
    ...filters,
    compatibility: filters.compatibility.filter(Boolean),
    houseRules: filters.houseRules.filter(Boolean),
    sort: filters.sort ?? defaults.sort,
    view: filters.view ?? defaults.view,
  };
}

function set(
  params: URLSearchParams,
  key: string,
  value: boolean | number | string | undefined,
) {
  if (value === undefined || value === "" || value === false) return;
  params.set(key, String(value));
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseBoolean(value: string | string[] | undefined) {
  return first(value) === "true";
}

function parseNumber(value: string | string[] | undefined) {
  const number = Number(first(value));
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function parseList(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value.join(",") : value;

  return (raw ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function includes<T extends string>(
  values: readonly T[],
  value?: string,
): value is T {
  return Boolean(value && values.includes(value as T));
}
