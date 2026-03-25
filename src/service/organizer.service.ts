import { apiClient, type FetchOptions } from "@/lib/api-client";
import { buildQueryString } from "@/lib/query/build-query-string";
import type {
  OrganizerProfile,
  OrganizerProfilePayload,
  OrganizerRevenueBreakdown,
  OrganizerRevenueQuery,
  PublicOrganizer,
  PublicOrganizerQuery,
  UpdateOrganizerProfilePayload,
} from "@/types/organizer.types";
import type { ApiResponse, ListApiResponse } from "@/types/response";

export const organizerService = {
  getPublicDirectory: async (
    query?: PublicOrganizerQuery,
    options?: FetchOptions,
  ): Promise<ListApiResponse<PublicOrganizer>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<PublicOrganizer>>(
      `organizer/public${qs}`,
      options,
    );
  },

  getPublicProfile: async (
    organizerId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<PublicOrganizer>> => {
    return apiClient.get<ApiResponse<PublicOrganizer>>(
      `organizer/public/${encodeURIComponent(organizerId)}`,
      options,
    );
  },

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

  updateProfile: async (
    payload: UpdateOrganizerProfilePayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<OrganizerProfile>> => {
    return apiClient.patch<ApiResponse<OrganizerProfile>>(
      "organizer/profile",
      payload,
      options,
    );
  },

  getRevenueBreakdown: async (
    query?: OrganizerRevenueQuery,
    options?: FetchOptions,
  ): Promise<ApiResponse<OrganizerRevenueBreakdown>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ApiResponse<OrganizerRevenueBreakdown>>(
      `organizer/analytics/revenue-breakdown${qs}`,
      options,
    );
  },
};
