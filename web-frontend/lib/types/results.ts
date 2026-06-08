import type { ListingPreview, ListingTrustBadge, Money } from "./listing";

export type ResultsViewMode = "list" | "map";
export type ResultsSortKey =
  | "recommended"
  | "price_asc"
  | "commute_asc"
  | "due_today_asc"
  | "rating_desc";

export type GenderPolicy =
  | "all_genders"
  | "mixed"
  | "women_only"
  | "men_only";
export type RoomType = ListingPreview["roomType"];
export type NoisePolicy = "quiet" | "balanced" | "lively";
export type GuestPolicy = "allowed" | "limited" | "not_allowed";
export type PetPolicy = "allowed" | "not_allowed";
export type SmokerPolicy = "allowed" | "outside_only" | "not_allowed";

export interface ListingCoordinates {
  lat: number;
  lng: number;
}

export interface SearchResultFilters {
  availability?: string;
  billsIncluded?: boolean;
  campus?: string;
  compatibility: string[];
  commuteMax?: number;
  dueTodayMax?: number;
  furnished?: boolean;
  genderPolicy?: GenderPolicy;
  guests?: GuestPolicy;
  houseRules: string[];
  location?: string;
  minStayMax?: number;
  noise?: NoisePolicy;
  pets?: PetPolicy;
  roomType?: RoomType;
  smoker?: SmokerPolicy;
  sort: ResultsSortKey;
  study?: boolean;
  totalMax?: number;
  verified?: boolean;
  view: ResultsViewMode;
}

export interface ActiveFilter {
  href: string;
  key: keyof SearchResultFilters | string;
  label: string;
}

export interface SearchResultRoommateProfile {
  ageRange: string;
  compatibilityScore: number;
  genderPolicy: GenderPolicy;
  tags: string[];
}

export interface ListingSearchResult {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  location: {
    campusLabel: string;
    city: string;
    commuteMinutes: number;
    coordinates: ListingCoordinates;
    neighborhood: string;
    state: string;
  };
  pricing: {
    billsIncluded: boolean;
    deposit: Money;
    dueToday: Money;
    totalMonthly: Money;
  };
  availability: {
    availableFrom: string;
    minStayMonths: number;
  };
  room: {
    furnished: boolean;
    type: RoomType;
  };
  rules: {
    guests: GuestPolicy;
    noise: NoisePolicy;
    pets: PetPolicy;
    smoker: SmokerPolicy;
    studyFriendly: boolean;
  };
  roommateProfile: SearchResultRoommateProfile;
  responseTimeLabel: string;
  rating: number;
  reviewCount: number;
  trustBadges: ListingTrustBadge[];
}

export interface MapCluster {
  count: number;
  id: string;
  listings: ListingSearchResult[];
  position: ListingCoordinates;
}

export interface SearchResultsResponse {
  activeFilters: ActiveFilter[];
  filters: SearchResultFilters;
  listings: ListingSearchResult[];
  totalCount: number;
}
