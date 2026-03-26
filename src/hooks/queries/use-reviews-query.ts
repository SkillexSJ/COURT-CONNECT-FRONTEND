"use client";

import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/query-keys";
import { QUERY_STALE_TIME } from "@/lib/query/query-defaults";
import { reviewService } from "@/service/review.service";
import type { Review, ReviewQueryParams } from "@/types/review.types";
import type { ListApiResponse } from "@/types/response";

export function useReviewsQuery(
  params: ReviewQueryParams,
  options?: Omit<
    UseQueryOptions<ListApiResponse<Review>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.reviews.list(params),
    queryFn: () => reviewService.getReviews(params),
    placeholderData: keepPreviousData,
    staleTime: QUERY_STALE_TIME.default,
    ...options,
    enabled: !!params.courtId || !!params.organizerId || options?.enabled,
  });
}
