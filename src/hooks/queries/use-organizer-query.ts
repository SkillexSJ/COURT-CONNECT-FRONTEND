"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/query-keys";
import { QUERY_STALE_TIME } from "@/lib/query/query-defaults";
import { organizerService } from "@/service/organizer.service";
import type { OrganizerProfile } from "@/types/organizer.types";
import type { ApiResponse } from "@/types/response";

export function useOrganizerProfileQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<OrganizerProfile>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.organizer.profile,
    queryFn: () => organizerService.getProfile(),
    staleTime: QUERY_STALE_TIME.default,
    ...options,
  });
}
