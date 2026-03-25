import type { UserRole } from "@/types/shared.types";

export type SignUpPayload = {
  email: string;
  password: string;
  name: string;
  image?: string;
};

export type SignUpWithImagePayload = {
  email: string;
  password: string;
  name: string;
  role: Extract<UserRole, "USER" | "ORGANIZER">;
  imageFile?: File;
  businessName?: string;
  phoneNumber?: string;
};

export type UserProfileImageResponse = {
  id: string;
  avatarUrl: string | null;
};

export type SignInPayload = {
  email: string;
  password: string;
};
