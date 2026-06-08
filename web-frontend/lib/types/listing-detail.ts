import type {
  GenderPolicy,
  GuestPolicy,
  ListingCoordinates,
  NoisePolicy,
  PetPolicy,
  RoomType,
  SearchResultRoommateProfile,
  SmokerPolicy,
} from "./results";
import type { ListingTrustBadge, Money } from "./listing";

export type ListingMediaType = "image" | "video" | "tour";

export interface ListingMediaItem {
  alt: string;
  id: string;
  posterUrl?: string;
  src: string;
  type: ListingMediaType;
}

export interface PricingLineItem {
  amount: Money;
  description: string;
  id: string;
  label: string;
}

export interface ListingDetailPricing {
  dueToday: Money;
  included: string[];
  lines: PricingLineItem[];
  monthlyTotal: Money;
}

export interface ListingDetailHost {
  avatarUrl?: string;
  bio: string;
  id: string;
  name: string;
  responseTimeLabel: string;
  sinceLabel: string;
  verification: string[];
}

export interface ListingDetailReview {
  author: string;
  dateLabel: string;
  id: string;
  quote: string;
  rating: number;
  stayContext: string;
}

export interface ListingDetailFAQ {
  answer: string;
  question: string;
}

export interface ListingDetail {
  amenities: string[];
  availability: {
    availableFrom: string;
    minStayMonths: number;
    visitWindows: string[];
  };
  campus: {
    coordinates: ListingCoordinates;
    distanceKm: number;
    label: string;
  };
  description: string;
  faq: ListingDetailFAQ[];
  host: ListingDetailHost;
  houseRules: {
    guests: GuestPolicy;
    noise: NoisePolicy;
    pets: PetPolicy;
    policySummary: string[];
    smoker: SmokerPolicy;
    studyFriendly: boolean;
  };
  idealFor: string[];
  location: {
    addressHint: string;
    city: string;
    commuteMinutes: number;
    coordinates: ListingCoordinates;
    neighborhood: string;
    state: string;
  };
  media: ListingMediaItem[];
  pricing: ListingDetailPricing;
  rating: number;
  reviews: ListingDetailReview[];
  reviewCount: number;
  room: {
    areaM2: number;
    bedLabel: string;
    furnished: boolean;
    privateBathroom: boolean;
    type: RoomType;
    windowLabel: string;
  };
  roommateProfile: SearchResultRoommateProfile & {
    genderPolicy: GenderPolicy;
    routine: string;
  };
  slug: string;
  summary: string;
  title: string;
  trustBadges: ListingTrustBadge[];
  verification: {
    listing: string[];
    landlord: string[];
  };
}
