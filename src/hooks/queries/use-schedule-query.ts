"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/query-keys";
import { QUERY_STALE_TIME } from "@/lib/query/query-defaults";
import { scheduleService } from "@/service/schedule.service";
import type { ApiResponse } from "@/types/response";
import type { AvailableSlot, SlotTemplatesByDay } from "@/types/schedule.types";

export function useSlotTemplatesQuery(
  courtId: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<SlotTemplatesByDay>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.schedule.templates(courtId),
    queryFn: () => scheduleService.getSlotTemplates(courtId),
    enabled: Boolean(courtId),
    staleTime: QUERY_STALE_TIME.default,
    ...options,
  });
}

export function useAvailableSlotsQuery(
  courtId: string,
  date: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<AvailableSlot[]>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.schedule.availableSlots(courtId, date),
    queryFn: () => scheduleService.getAvailableSlots(courtId, date),
    enabled: Boolean(courtId && date),
    staleTime: QUERY_STALE_TIME.realtime,
    ...options,
  });
}
