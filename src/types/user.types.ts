import type { UserRole } from "@/types/shared.types";

export type UserProfile = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  role: UserRole;
  phone: string | null;
  avatarUrl: string | null;
  isApproved?: boolean;
  createdAt: string;
  _count?: {
    bookings: number;
  };
};

export type UpdateUserProfilePayload = Partial<{
  name: string;
  phone: string | null;
  avatarUrl: string | null;
}>;
