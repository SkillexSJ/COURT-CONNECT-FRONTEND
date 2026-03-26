import { apiClient, type FetchOptions } from "@/lib/api-client";
import { buildQueryString } from "@/lib/query/build-query-string";
import type { ApiResponse, ListApiResponse } from "@/types/response";
import type {
  CreateReviewPayload,
  Review,
  ReviewQueryParams,
  UpdateReviewPayload,
} from "@/types/review.types";

export const reviewService = {
  getReviews: async (
    query?: ReviewQueryParams,
    options?: FetchOptions,
  ): Promise<ListApiResponse<Review>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<Review>>(`reviews${qs}`, options);
  },

  createReview: async (
    payload: CreateReviewPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<Review>> => {
    return apiClient.post<ApiResponse<Review>>("reviews", payload, options);
  },

  updateReview: async (
    reviewId: string,
    payload: UpdateReviewPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<Review>> => {
    return apiClient.patch<ApiResponse<Review>>(
      `reviews/${encodeURIComponent(reviewId)}`,
      payload,
      options,
    );
  },

  deleteReview: async (
    reviewId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<Review>> => {
    return apiClient.delete<ApiResponse<Review>>(
      `reviews/${encodeURIComponent(reviewId)}`,
      options,
    );
  },
};
