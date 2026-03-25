import { apiClient, type FetchOptions } from "@/lib/api-client";
import { buildQueryString } from "@/lib/query/build-query-string";
import {
  AmenityPayload,
  CourtAmenity,
  CourtDetails,
  CourtListItem,
  CourtMediaItem,
  CourtMember,
  CourtMemberQueryParams,
  CourtQueryParams,
  CreateCourtPayload,
  UpdateCourtPayload,
  UploadCourtMediaPayload,
} from "@/types/court.types";
import type { ApiResponse, ListApiResponse } from "@/types/response";

export const courtService = {
  /**
   * POST /api/courts
   * Create a new court (ORGANIZER or ADMIN)
   */
  createCourt: async (
    payload: CreateCourtPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtListItem>> => {
    return apiClient.post<ApiResponse<CourtListItem>>(
      "courts",
      payload,
      options,
    );
  },

  /**
   * GET /api/courts
   * Public list of courts
   */
  getAllCourts: async (
    query?: CourtQueryParams,
    options?: FetchOptions,
  ): Promise<ListApiResponse<CourtListItem>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<CourtListItem>>(
      `courts${qs}`,
      options,
    );
  },

  /**
   * GET /api/courts/:slug
   * Public single court details
   */
  getCourtBySlug: async (
    slug: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtDetails>> => {
    return apiClient.get<ApiResponse<CourtDetails>>(
      `courts/${encodeURIComponent(slug)}`,
      options,
    );
  },

  /**
   * GET /api/courts/amenities
   * Public amenities list for organizer court form.
   */
  getAmenities: async (
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtAmenity[]>> => {
    return apiClient.get<ApiResponse<CourtAmenity[]>>(
      "courts/amenities",
      options,
    );
  },

  /**
   * GET /api/courts/organizer/my-courts
   * Courts owned by logged-in organizer
   */
  getOrganizerCourts: async (
    query?: CourtQueryParams,
    options?: FetchOptions,
  ): Promise<ListApiResponse<CourtListItem>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<CourtListItem>>(
      `courts/organizer/my-courts${qs}`,
      options,
    );
  },

  /**
   * PATCH /api/courts/:courtId
   * Update court owned by organizer/admin
   */
  updateCourt: async (
    courtId: string,
    payload: UpdateCourtPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtListItem>> => {
    return apiClient.patch<ApiResponse<CourtListItem>>(
      `courts/${encodeURIComponent(courtId)}`,
      payload,
      options,
    );
  },

  /**
   * POST /api/courts/:courtId/media
   * Upload primary/gallery images to Cloudinary and persist media rows.
   */
  uploadCourtMedia: async (
    courtId: string,
    payload: UploadCourtMediaPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtMediaItem[]>> => {
    const formData = new FormData();

    if (payload.primaryImage) {
      formData.append("images", payload.primaryImage);
      formData.append("primaryIndex", "0");
    }

    for (const file of payload.galleryImages ?? []) {
      formData.append("images", file);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90_000);

    try {
      return await apiClient.post<ApiResponse<CourtMediaItem[]>>(
        `courts/${encodeURIComponent(courtId)}/media`,
        formData,
        {
          ...options,
          signal: controller.signal,
        },
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Image upload timed out. Please try smaller images.");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * DELETE /api/courts/:courtId
   * Soft-delete a court (status => HIDDEN)
   */
  deleteCourt: async (
    courtId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtListItem>> => {
    return apiClient.delete<ApiResponse<CourtListItem>>(
      `courts/${encodeURIComponent(courtId)}`,
      options,
    );
  },

  /**
   * GET /api/courts/:courtId/members
   * Members/bookers of a specific court
   */
  getCourtMembers: async (
    courtId: string,
    query?: CourtMemberQueryParams,
    options?: FetchOptions,
  ): Promise<ListApiResponse<CourtMember>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<CourtMember>>(
      `courts/${encodeURIComponent(courtId)}/members${qs}`,
      options,
    );
  },

  /**
   * GET /api/admin/courts/pending
   * Admin-only list of courts waiting for approval
   */
  getPendingCourtsForAdmin: async (
    query?: CourtQueryParams,
    options?: FetchOptions,
  ): Promise<ListApiResponse<CourtListItem>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<CourtListItem>>(
      `admin/courts/pending${qs}`,
      options,
    );
  },

  /**
   * PATCH /api/admin/courts/:courtId/approve
   * Admin approves a pending court and activates it
   */
  approveCourtByAdmin: async (
    courtId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtListItem>> => {
    return apiClient.patch<ApiResponse<CourtListItem>>(
      `admin/courts/${encodeURIComponent(courtId)}/approve`,
      {},
      options,
    );
  },

  /**
   * GET /api/admin/amenities
   * Admin-only amenities management list.
   */
  getAmenitiesForAdmin: async (
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtAmenity[]>> => {
    return apiClient.get<ApiResponse<CourtAmenity[]>>(
      "admin/amenities",
      options,
    );
  },

  /**
   * POST /api/admin/amenities
   * Admin creates amenity.
   */
  createAmenityByAdmin: async (
    payload: AmenityPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtAmenity>> => {
    return apiClient.post<ApiResponse<CourtAmenity>>(
      "admin/amenities",
      payload,
      options,
    );
  },

  /**
   * PATCH /api/admin/amenities/:amenityId
   * Admin updates amenity.
   */
  updateAmenityByAdmin: async (
    amenityId: string,
    payload: Partial<AmenityPayload>,
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtAmenity>> => {
    return apiClient.patch<ApiResponse<CourtAmenity>>(
      `admin/amenities/${encodeURIComponent(amenityId)}`,
      payload,
      options,
    );
  },

  /**
   * DELETE /api/admin/amenities/:amenityId
   * Admin deletes amenity.
   */
  deleteAmenityByAdmin: async (
    amenityId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<CourtAmenity>> => {
    return apiClient.delete<ApiResponse<CourtAmenity>>(
      `admin/amenities/${encodeURIComponent(amenityId)}`,
      options,
    );
  },
};
