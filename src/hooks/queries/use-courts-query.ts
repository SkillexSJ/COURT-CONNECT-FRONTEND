"use client";

import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/query-keys";
import { QUERY_STALE_TIME } from "@/lib/query/query-defaults";
import { courtService } from "@/service/court.service";
import type {
  CourtAmenity,
  CourtListItem,
  CourtQueryParams,
} from "@/types/court.types";
import type { ApiResponse, ListApiResponse } from "@/types/response";

/**
 * Court-related queries, including fetching courts and amenities.
 */

export const HOME_LANDING_COURTS_QUERY_PARAMS = {
  status: "ACTIVE",
  limit: 50,
  sortBy: "-createdAt",
} as const satisfies CourtQueryParams;

export function useCourtsQuery(
  params: CourtQueryParams,
  options?: Omit<
    UseQueryOptions<ListApiResponse<CourtListItem>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.courts.list(params),
    queryFn: () => courtService.getAllCourts(params),
    placeholderData: keepPreviousData,
    staleTime: QUERY_STALE_TIME.default,
    ...options,
  });
}

export function useHomeLandingCourtsQuery(
  options?: Omit<
    UseQueryOptions<ListApiResponse<CourtListItem>>,
    "queryKey" | "queryFn"
  >,
) {
  return useCourtsQuery(HOME_LANDING_COURTS_QUERY_PARAMS, options);
}

export function useAmenitiesQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<CourtAmenity[]>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.courts.amenities,
    queryFn: () => courtService.getAmenities(),
    staleTime: QUERY_STALE_TIME.static,
    ...options,
  });
}
