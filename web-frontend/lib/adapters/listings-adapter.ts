import { featuredListings } from "@/lib/constants/mock-data";
import type { ListingFilters, ListingPreview } from "@/lib/types";
import { requestJson } from "./http-client";

export interface ListingsAdapter {
  search(filters?: ListingFilters): Promise<ListingPreview[]>;
}

export function createListingsAdapter(): ListingsAdapter {
  return {
    async search(filters) {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        return filterMockListings(filters);
      }

      const { data } = await requestJson<ListingPreview[]>({
        path: "listings",
        query: filters
          ? {
              billsIncluded: filters.billsIncluded,
              campus: filters.campus,
              location: filters.location,
              maxPrice: filters.maxPrice,
              moveIn: filters.moveIn,
              nearCampus: filters.nearCampus,
              onlyVerified: filters.onlyVerified,
              quiet: filters.quiet,
              roomType: filters.roomType,
            }
          : undefined,
      });

      return data;
    },
  };
}

function filterMockListings(filters?: ListingFilters) {
  return featuredListings.filter((listing) => {
    const location = normalize(filters?.location ?? filters?.campus);

    if (location) {
      const haystack = normalize(
        [
          listing.title,
          listing.location.neighborhood,
          listing.location.city,
          listing.location.state,
          ...listing.campusTags,
        ].join(" "),
      );

      if (!haystack.includes(location)) {
        return false;
      }
    }

    if (filters?.maxPrice && listing.price.amount > filters.maxPrice) {
      return false;
    }

    if (filters?.roomType && listing.roomType !== filters.roomType) {
      return false;
    }

    if (
      filters?.onlyVerified &&
      !listing.trustBadges.includes("verified_owner")
    ) {
      return false;
    }

    if (
      filters?.billsIncluded &&
      !listing.amenities.some((amenity) => amenity.id === "bills")
    ) {
      return false;
    }

    if (
      filters?.quiet &&
      !listing.amenities.some((amenity) => amenity.id === "quiet")
    ) {
      return false;
    }

    if (
      filters?.nearCampus &&
      (listing.location.distanceToCampusInMinutes ?? 999) > 10
    ) {
      return false;
    }

    if (
      filters?.moveIn &&
      new Date(listing.availableFrom).getTime() >
        new Date(filters.moveIn).getTime()
    ) {
      return false;
    }

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
