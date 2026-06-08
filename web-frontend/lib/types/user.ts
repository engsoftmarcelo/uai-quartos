export type UserRole = "STUDENT" | "LANDLORD" | "ADMIN";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  avatarUrl?: string;
}
