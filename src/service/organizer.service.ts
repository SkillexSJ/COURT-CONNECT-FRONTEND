import { apiClient, type FetchOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/response";

export type OrganizerProfilePayload = {
  businessName: string;
  bio?: string;
  website?: string;
  phoneNumber?: string;
  address?: string;
};

export type OrganizerProfile = {
  id: string;
  userId: string;
  businessName: string;
  bio: string | null;
  website: string | null;
  phoneNumber: string | null;
  address: string | null;
  isVerified: boolean;
  stripeAccountId: string | null;
  createdAt: string;
  updatedAt: string;
};

export const organizerService = {
  createProfile: async (
    payload: OrganizerProfilePayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<OrganizerProfile>> => {
    return apiClient.post<ApiResponse<OrganizerProfile>>(
      "organizer/profile",
      payload,
      options,
    );
  },

  getProfile: async (
    options?: FetchOptions,
  ): Promise<ApiResponse<OrganizerProfile>> => {
    return apiClient.get<ApiResponse<OrganizerProfile>>(
      "organizer/profile",
      options,
    );
  },
};
