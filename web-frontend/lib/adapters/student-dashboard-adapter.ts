import {
  studentApplications,
  studentConversations,
  studentDashboardOverview,
  studentPreferences,
  studentProfileSummary,
  studentSavedListings,
} from "@/lib/constants";
import type {
  StudentApplication,
  StudentConversation,
  StudentDashboardOverview,
  StudentHousingPreferences,
  StudentProfileSummary,
  StudentSavedListing,
} from "@/lib/types";
import { requestJson } from "./http-client";

export interface StudentDashboardAdapter {
  getApplications(): Promise<StudentApplication[]>;
  getConversations(): Promise<StudentConversation[]>;
  getFavorites(): Promise<StudentSavedListing[]>;
  getOverview(): Promise<StudentDashboardOverview>;
  getProfile(): Promise<{
    preferences: StudentHousingPreferences;
    profile: StudentProfileSummary;
  }>;
}

export function createStudentDashboardAdapter(): StudentDashboardAdapter {
  return {
    async getApplications() {
      if (!process.env.NEXT_PUBLIC_API_URL) return studentApplications;
      const { data } = await requestJson<StudentApplication[]>({
        path: "student/applications",
      });
      return data;
    },
    async getConversations() {
      if (!process.env.NEXT_PUBLIC_API_URL) return studentConversations;
      const { data } = await requestJson<StudentConversation[]>({
        path: "student/conversations",
      });
      return data;
    },
    async getFavorites() {
      if (!process.env.NEXT_PUBLIC_API_URL) return studentSavedListings;
      const { data } = await requestJson<StudentSavedListing[]>({
        path: "student/favorites",
      });
      return data;
    },
    async getOverview() {
      if (!process.env.NEXT_PUBLIC_API_URL) return studentDashboardOverview;
      const { data } = await requestJson<StudentDashboardOverview>({
        path: "student/dashboard",
      });
      return data;
    },
    async getProfile() {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        return {
          preferences: studentPreferences,
          profile: studentProfileSummary,
        };
      }
      const { data } = await requestJson<{
        preferences: StudentHousingPreferences;
        profile: StudentProfileSummary;
      }>({
        path: "student/profile",
      });
      return data;
    },
  };
}
