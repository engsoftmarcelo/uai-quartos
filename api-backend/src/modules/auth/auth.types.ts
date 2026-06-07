import { KycStatus, Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  kycStatus: KycStatus;
  sid: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  kycStatus: KycStatus;
  sessionId: string;
}

export interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}
