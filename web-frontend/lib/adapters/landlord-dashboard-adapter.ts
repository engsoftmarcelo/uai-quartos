import {
  landlordApplicants,
  landlordCalendar,
  landlordDashboardOverview,
  landlordLeads,
  landlordListingDraft,
  landlordListings,
  landlordPerformance,
  landlordProfile,
  landlordReviews,
} from "@/lib/constants";
import type {
  LandlordApplicant,
  LandlordCalendarSlot,
  LandlordDashboardOverview,
  LandlordLead,
  LandlordListing,
  LandlordListingDraft,
  LandlordPerformancePoint,
  LandlordProfile,
  LandlordReview,
} from "@/lib/types";
import { requestJson } from "./http-client";

export interface LandlordDashboardAdapter {
  getApplicants(): Promise<LandlordApplicant[]>;
  getCalendar(): Promise<LandlordCalendarSlot[]>;
  getDraft(listingId?: string): Promise<LandlordListingDraft>;
  getInsights(): Promise<{
    listings: LandlordListing[];
    performance: LandlordPerformancePoint[];
    reviews: LandlordReview[];
  }>;
  getLeads(): Promise<LandlordLead[]>;
  getListing(id: string): Promise<LandlordListing | null>;
  getListings(): Promise<LandlordListing[]>;
  getOverview(): Promise<LandlordDashboardOverview>;
  getProfile(): Promise<LandlordProfile>;
}

export function createLandlordDashboardAdapter(): LandlordDashboardAdapter {
  return {
    async getApplicants() {
      if (!process.env.NEXT_PUBLIC_API_URL) return landlordApplicants;
      const { data } = await requestJson<LandlordApplicant[]>({
        path: "landlord/applicants",
      });
      return data;
    },
    async getCalendar() {
      if (!process.env.NEXT_PUBLIC_API_URL) return landlordCalendar;
      const { data } = await requestJson<LandlordCalendarSlot[]>({
        path: "landlord/calendar",
      });
      return data;
    },
    async getDraft(listingId) {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        const listing = listingId
          ? landlordListings.find((item) => item.id === listingId)
          : null;

        return listing
          ? {
              ...landlordListingDraft,
              availabilityLabel: listing.availableFromLabel,
              depositAmount: Math.round(listing.monthlyTotal.amount * 0.7),
              id: listing.id,
              imageUrl: listing.imageUrl,
              listingTitle: listing.title,
              monthlyRent: listing.monthlyTotal.amount,
              neighborhood: listing.addressLabel.split(",")[0] ?? "",
            }
          : landlordListingDraft;
      }

      const { data } = await requestJson<LandlordListingDraft>({
        path: listingId
          ? `landlord/listings/${listingId}/draft`
          : "landlord/listings/draft",
      });
      return data;
    },
    async getInsights() {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        return {
          listings: landlordListings,
          performance: landlordPerformance,
          reviews: landlordReviews,
        };
      }
      const { data } = await requestJson<{
        listings: LandlordListing[];
        performance: LandlordPerformancePoint[];
        reviews: LandlordReview[];
      }>({
        path: "landlord/insights",
      });
      return data;
    },
    async getLeads() {
      if (!process.env.NEXT_PUBLIC_API_URL) return landlordLeads;
      const { data } = await requestJson<LandlordLead[]>({
        path: "landlord/leads",
      });
      return data;
    },
    async getListing(id) {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        return landlordListings.find((listing) => listing.id === id) ?? null;
      }
      const { data } = await requestJson<LandlordListing | null>({
        path: `landlord/listings/${id}`,
      });
      return data;
    },
    async getListings() {
      if (!process.env.NEXT_PUBLIC_API_URL) return landlordListings;
      const { data } = await requestJson<LandlordListing[]>({
        path: "landlord/listings",
      });
      return data;
    },
    async getOverview() {
      if (!process.env.NEXT_PUBLIC_API_URL) return landlordDashboardOverview;
      const { data } = await requestJson<LandlordDashboardOverview>({
        path: "landlord/dashboard",
      });
      return data;
    },
    async getProfile() {
      if (!process.env.NEXT_PUBLIC_API_URL) return landlordProfile;
      const { data } = await requestJson<LandlordProfile>({
        path: "landlord/profile",
      });
      return data;
    },
  };
}
