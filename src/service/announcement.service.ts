import { apiClient, type FetchOptions } from "@/lib/api-client";
import { buildQueryString } from "@/lib/query/build-query-string";
import type {
  Announcement,
  AnnouncementListQuery,
  CreateAnnouncementPayload,
  HomeAnnouncementQuery,
  UpdateAnnouncementPayload,
  VenueAnnouncementQuery,
} from "@/types/announcement.types";
import type { ApiResponse, ListApiResponse } from "@/types/response";

export const announcementService = {
  getAllAnnouncements: async (
    query?: AnnouncementListQuery,
    options?: FetchOptions,
  ): Promise<ListApiResponse<Announcement>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<Announcement>>(
      `announcements${qs}`,
      options,
    );
  },

  getHomeAnnouncements: async (
    query?: HomeAnnouncementQuery,
    options?: FetchOptions,
  ): Promise<ListApiResponse<Announcement>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<Announcement>>(
      `announcements/home${qs}`,
      options,
    );
  },

  getVenueAnnouncements: async (
    courtId: string,
    query?: VenueAnnouncementQuery,
    options?: FetchOptions,
  ): Promise<ListApiResponse<Announcement>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<Announcement>>(
      `announcements/venue/${encodeURIComponent(courtId)}${qs}`,
      options,
    );
  },

  getAnnouncementById: async (
    announcementId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<Announcement>> => {
    return apiClient.get<ApiResponse<Announcement>>(
      `announcements/${encodeURIComponent(announcementId)}`,
      options,
    );
  },

  createAnnouncement: async (
    payload: CreateAnnouncementPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<Announcement>> => {
    return apiClient.post<ApiResponse<Announcement>>(
      "announcements",
      payload,
      options,
    );
  },

  updateAnnouncement: async (
    announcementId: string,
    payload: UpdateAnnouncementPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<Announcement>> => {
    return apiClient.patch<ApiResponse<Announcement>>(
      `announcements/${encodeURIComponent(announcementId)}`,
      payload,
      options,
    );
  },

  deleteAnnouncement: async (
    announcementId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(
      `announcements/${encodeURIComponent(announcementId)}`,
      options,
    );
  },
};
