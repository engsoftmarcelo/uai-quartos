import { getListingDetailBySlug, listingDetails } from "@/lib/constants";
import type { ListingDetail } from "@/lib/types";
import { requestJson } from "./http-client";

export interface ListingDetailAdapter {
  getBySlug(slug: string): Promise<ListingDetail | null>;
  listSlugs(): Promise<string[]>;
}

export function createListingDetailAdapter(): ListingDetailAdapter {
  return {
    async getBySlug(slug) {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        return getListingDetailBySlug(slug) ?? null;
      }

      const { data } = await requestJson<ListingDetail>({
        path: `listings/${slug}`,
      });

      return data;
    },
    async listSlugs() {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        return listingDetails.map((listing) => listing.slug);
      }

      const { data } = await requestJson<{ slugs: string[] }>({
        path: "listings/slugs",
      });

      return data.slugs;
    },
  };
}
