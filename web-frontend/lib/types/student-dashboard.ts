import type { Money } from "./listing";

export type StudentApplicationStatus =
  | "draft"
  | "sent"
  | "under_review"
  | "visit_scheduled"
  | "approved"
  | "rejected";

export type ChecklistStatus = "done" | "pending" | "warning";
export type MessageReadState = "read" | "unread";

export interface StudentProfileSummary {
  avatarUrl?: string;
  campus: string;
  course: string;
  email: string;
  id: string;
  matchCompletion: number;
  name: string;
  university: string;
  verificationStatus: "pending" | "verified" | "rejected";
}

export interface StudentHousingPreferences {
  budgetMax: Money;
  commuteMaxMinutes: number;
  houseStyle: string[];
  moveInWindow: string;
  priorities: string[];
}

export interface StudentChecklistItem {
  description: string;
  href: string;
  id: string;
  label: string;
  status: ChecklistStatus;
}

export interface StudentSavedListing {
  changes: string[];
  campusLabel: string;
  dueToday: Money;
  id: string;
  imageUrl: string;
  matchScore: number;
  neighborhood: string;
  savedAtLabel: string;
  slug: string;
  tags: string[];
  title: string;
  totalMonthly: Money;
}

export interface StudentMessage {
  attachmentLabel?: string;
  body: string;
  id: string;
  isMine: boolean;
  sentAtLabel: string;
}

export interface StudentConversation {
  connectedListing: StudentSavedListing;
  id: string;
  lastMessage: string;
  messages: StudentMessage[];
  participantName: string;
  readState: MessageReadState;
  trustNotice: string;
  unreadCount: number;
  updatedAtLabel: string;
}

export interface StudentApplicationTimelineEvent {
  description: string;
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
  timestampLabel: string;
}

export interface StudentApplication {
  documentsPending: string[];
  history: StudentApplicationTimelineEvent[];
  id: string;
  listing: StudentSavedListing;
  nextAction: string;
  status: StudentApplicationStatus;
  submittedAtLabel: string;
}

export interface StudentAvailabilityAlert {
  href: string;
  id: string;
  label: string;
  meta: string;
}

export interface StudentDashboardOverview {
  alerts: StudentAvailabilityAlert[];
  applications: StudentApplication[];
  checklist: StudentChecklistItem[];
  conversations: StudentConversation[];
  preferences: StudentHousingPreferences;
  profile: StudentProfileSummary;
  recommendations: StudentSavedListing[];
  savedListings: StudentSavedListing[];
}
