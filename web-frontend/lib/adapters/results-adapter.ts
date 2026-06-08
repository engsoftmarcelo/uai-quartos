import { listingSearchResults } from "@/lib/constants/results-data";
import type {
  ListingSearchResult,
  SearchResultFilters,
  SearchResultsResponse,
} from "@/lib/types";
import { getActiveResultFilters } from "@/lib/utils/results-params";
import { requestJson } from "./http-client";

export interface ResultsAdapter {
  search(filters: SearchResultFilters): Promise<SearchResultsResponse>;
}

export function createResultsAdapter(): ResultsAdapter {
  return {
    async search(filters) {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        const listings = sortListings(filterListings(filters), filters);

        return {
          activeFilters: getActiveResultFilters(filters),
          filters,
          listings,
          totalCount: listings.length,
        };
      }

      const { data } = await requestJson<SearchResultsResponse>({
        path: "listings/results",
        query: {
          availability: filters.availability,
          billsIncluded: filters.billsIncluded,
          campus: filters.campus,
          commuteMax: filters.commuteMax,
          compat: filters.compatibility.join(","),
          dueTodayMax: filters.dueTodayMax,
          furnished: filters.furnished,
          genderPolicy: filters.genderPolicy,
          guests: filters.guests,
          houseRules: filters.houseRules.join(","),
          location: filters.location,
          minStayMax: filters.minStayMax,
          noise: filters.noise,
          pets: filters.pets,
          roomType: filters.roomType,
          smoker: filters.smoker,
          sort: filters.sort,
          study: filters.study,
          totalMax: filters.totalMax,
          verified: filters.verified,
        },
      });

      return data;
    },
  };
}

function filterListings(filters: SearchResultFilters) {
  return listingSearchResults.filter((listing) => {
    const place = normalize(filters.location ?? filters.campus);
    const haystack = normalize(
      [
        listing.title,
        listing.location.campusLabel,
        listing.location.neighborhood,
        listing.location.city,
        listing.location.state,
      ].join(" "),
    );

    if (place && !haystack.includes(place)) return false;
    if (
      filters.totalMax &&
      listing.pricing.totalMonthly.amount > filters.totalMax
    ) {
      return false;
    }
    if (
      filters.dueTodayMax &&
      listing.pricing.dueToday.amount > filters.dueTodayMax
    ) {
      return false;
    }
    if (filters.billsIncluded && !listing.pricing.billsIncluded) return false;
    if (filters.roomType && listing.room.type !== filters.roomType) return false;
    if (
      filters.availability &&
      new Date(listing.availability.availableFrom).getTime() >
        new Date(filters.availability).getTime()
    ) {
      return false;
    }
    if (
      filters.genderPolicy &&
      listing.roommateProfile.genderPolicy !== filters.genderPolicy
    ) {
      return false;
    }
    if (filters.pets && listing.rules.pets !== filters.pets) return false;
    if (filters.smoker && listing.rules.smoker !== filters.smoker) return false;
    if (filters.noise && listing.rules.noise !== filters.noise) return false;
    if (filters.study && !listing.rules.studyFriendly) return false;
    if (filters.guests && listing.rules.guests !== filters.guests) return false;
    if (filters.furnished && !listing.room.furnished) return false;
    if (
      filters.minStayMax &&
      listing.availability.minStayMonths > filters.minStayMax
    ) {
      return false;
    }
    if (
      filters.commuteMax &&
      listing.location.commuteMinutes > filters.commuteMax
    ) {
      return false;
    }
    if (
      filters.verified &&
      !listing.trustBadges.includes("verified_owner")
    ) {
      return false;
    }
    if (!matchesCompatibility(listing, filters.compatibility)) return false;
    if (!matchesHouseRules(listing, filters.houseRules)) return false;

    return true;
  });
}

function sortListings(
  listings: ListingSearchResult[],
  filters: SearchResultFilters,
) {
  const sorted = [...listings];

  if (filters.sort === "price_asc") {
    sorted.sort((a, b) => a.pricing.totalMonthly.amount - b.pricing.totalMonthly.amount);
  } else if (filters.sort === "commute_asc") {
    sorted.sort((a, b) => a.location.commuteMinutes - b.location.commuteMinutes);
  } else if (filters.sort === "due_today_asc") {
    sorted.sort((a, b) => a.pricing.dueToday.amount - b.pricing.dueToday.amount);
  } else if (filters.sort === "rating_desc") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else {
    sorted.sort((a, b) => {
      const aScore =
        a.roommateProfile.compatibilityScore * 2 -
        a.location.commuteMinutes +
        a.rating * 10;
      const bScore =
        b.roommateProfile.compatibilityScore * 2 -
        b.location.commuteMinutes +
        b.rating * 10;

      return bScore - aScore;
    });
  }

  return sorted;
}

function matchesCompatibility(
  listing: ListingSearchResult,
  compatibility: string[],
) {
  if (!compatibility.length) return true;

  const tags = normalize(listing.roommateProfile.tags.join(" "));

  return compatibility.every((item) => tags.includes(normalize(item)));
}

function matchesHouseRules(
  listing: ListingSearchResult,
  houseRules: string[],
) {
  if (!houseRules.length) return true;

  return houseRules.every((rule) => {
    if (rule === "visitas-combinadas") return listing.rules.guests !== "not_allowed";
    if (rule === "sem-fumante") return listing.rules.smoker === "not_allowed";
    if (rule === "contrato-pronto") {
      return listing.trustBadges.includes("contract_ready");
    }
    if (rule === "rotina-silenciosa") return listing.rules.noise === "quiet";

    return true;
  });
}

function normalize(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
