import type { Money } from "./listing";

export type LandlordListingStatus = "active" | "paused" | "archived" | "draft";
export type LandlordLeadStage =
  | "new"
  | "contacted"
  | "visit_scheduled"
  | "proposal"
  | "won"
  | "lost";
export type LandlordApplicantStage =
  | "screening"
  | "documents"
  | "visit"
  | "decision"
  | "approved"
  | "rejected";
export type LandlordCalendarStatus = "available" | "blocked" | "visit" | "conflict";
export type LandlordTaskSeverity = "critical" | "warning" | "info";

export interface LandlordProfile {
  averageResponseMinutes: number;
  documentsVerified: boolean;
  email: string;
  id: string;
  name: string;
  phone: string;
  reputationScore: number;
  verificationStatus: "verified" | "pending" | "rejected";
}

export interface LandlordKPI {
  description: string;
  id: string;
  label: string;
  trendLabel: string;
  value: string;
}

export interface LandlordTask {
  description: string;
  href: string;
  id: string;
  label: string;
  severity: LandlordTaskSeverity;
}

export interface LandlordListing {
  activeLeads: number;
  addressLabel: string;
  availableFromLabel: string;
  completionScore: number;
  id: string;
  imageUrl: string;
  lastUpdatedLabel: string;
  minimumStayMonths: number;
  monthlyTotal: Money;
  occupancyLabel: string;
  qualityIssues: string[];
  responseRate: number;
  roomsAvailable: number;
  status: LandlordListingStatus;
  title: string;
  viewsLast30Days: number;
}

export interface LandlordLeadInteraction {
  id: string;
  label: string;
  timestampLabel: string;
}

export interface LandlordLead {
  budgetLabel: string;
  connectedListingId: string;
  id: string;
  lastInteractionLabel: string;
  matchScore: number;
  messagePreview: string;
  name: string;
  stage: LandlordLeadStage;
  unread: boolean;
  visitTimeLabel?: string;
  interactions: LandlordLeadInteraction[];
}

export interface LandlordApplicant {
  connectedListingId: string;
  documentsPending: string[];
  id: string;
  lastActionLabel: string;
  matchScore: number;
  name: string;
  nextAction: string;
  stage: LandlordApplicantStage;
}

export interface LandlordCalendarSlot {
  dateLabel: string;
  id: string;
  listingId: string;
  note: string;
  status: LandlordCalendarStatus;
}

export interface LandlordPerformancePoint {
  applications: number;
  contacts: number;
  conversionRate: number;
  label: string;
  views: number;
}

export interface LandlordReview {
  authorName: string;
  body: string;
  id: string;
  listingTitle: string;
  rating: number;
  receivedAtLabel: string;
}

export interface LandlordListingDraft {
  availabilityLabel: string;
  billsIncluded: boolean;
  description: string;
  depositAmount: number;
  houseRules: string[];
  id?: string;
  imageUrl: string;
  listingTitle: string;
  monthlyRent: number;
  neighborhood: string;
  profileTags: string[];
  roomType: "private" | "shared" | "suite";
}

export interface LandlordDashboardOverview {
  applicants: LandlordApplicant[];
  calendar: LandlordCalendarSlot[];
  kpis: LandlordKPI[];
  leads: LandlordLead[];
  listings: LandlordListing[];
  performance: LandlordPerformancePoint[];
  profile: LandlordProfile;
  reviews: LandlordReview[];
  tasks: LandlordTask[];
}
