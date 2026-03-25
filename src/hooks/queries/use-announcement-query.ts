"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/query-keys";
import { announcementService } from "@/service/announcement.service";

export function useHomeAnnouncementsQuery(query?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  type?: "INFO" | "MAINTENANCE" | "PROMOTION";
}) {
  return useQuery({
    queryKey: queryKeys.announcements.home(query),
    queryFn: () => announcementService.getHomeAnnouncements(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useVenueAnnouncementsQuery(
  courtId: string,
  query?: {
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    type?: "INFO" | "MAINTENANCE" | "PROMOTION";
  },
) {
  return useQuery({
    queryKey: queryKeys.announcements.venue(courtId, query),
    queryFn: () => announcementService.getVenueAnnouncements(courtId, query),
    placeholderData: keepPreviousData,
    enabled: Boolean(courtId),
    staleTime: 30_000,
  });
}

export function useAnnouncementsAdminQuery(query?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  type?: "INFO" | "MAINTENANCE" | "PROMOTION";
  audience?: "HOME" | "VENUE";
  courtId?: string;
  isPublished?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.announcements.list(query),
    queryFn: () => announcementService.getAllAnnouncements(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
