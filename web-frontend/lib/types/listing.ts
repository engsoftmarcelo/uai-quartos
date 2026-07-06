export type ListingTrustBadge =
  | "verified_owner"
  | "student_friendly"
  | "contract_ready"
  | "bill_split";

export interface Money {
  amount: number;
  currency: "BRL";
}

export interface ListingAmenity {
  id: string;
  label: string;
}

export interface ListingLocation {
  neighborhood: string;
  city: string;
  state: string;
  distanceToCampusInMinutes?: number;
}

export interface ListingPreview {
  id: string;
  title: string;
  campusTags: string[];
  imageUrl: string;
  location: ListingLocation;
  price: Money;
  /** Indica se o preço mensal já cobre água, luz e internet. */
  billsIncluded?: boolean;
  /** Percentual (0-100) de compatibilidade de convivência com o perfil do estudante. */
  compatibilityScore?: number;
  roomType: "private" | "shared" | "suite";
  capacity: number;
  availableFrom: string;
  rating: number;
  reviewCount: number;
  amenities: ListingAmenity[];
  matchHighlights: string[];
  trustBadges: ListingTrustBadge[];
}

export interface ListingFilters {
  campus?: string;
  billsIncluded?: boolean;
  location?: string;
  maxPrice?: number;
  moveIn?: string;
  nearCampus?: boolean;
  quiet?: boolean;
  roomType?: ListingPreview["roomType"];
  onlyVerified?: boolean;
}
