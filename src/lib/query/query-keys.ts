import type { CourtQueryParams } from "@/types/court.types";
import { createEntityQueryKeys } from "@/lib/query/query-key-factory";

/**
 * A CENTRALIZED DEFINITION OF QUERIES FOR TANSTACK
 */

const courtsEntityKeys = createEntityQueryKeys<CourtQueryParams>("courts");
const organizerEntityKeys = createEntityQueryKeys("organizer");
const scheduleEntityKeys = createEntityQueryKeys("schedule");
const announcementEntityKeys = createEntityQueryKeys("announcements");

const courtsQueryKeys = {
  ...courtsEntityKeys,
  amenities: [...courtsEntityKeys.all, "amenities"] as const,
};

const organizerQueryKeys = {
  ...organizerEntityKeys,
  profile: [...organizerEntityKeys.all, "profile"] as const,
};

const scheduleQueryKeys = {
  ...scheduleEntityKeys,
  templates: (courtId: string) =>
    [...scheduleEntityKeys.all, "templates", courtId] as const,
  availableSlots: (courtId: string, date: string) =>
    [...scheduleEntityKeys.all, "available-slots", courtId, date] as const,
};

const announcementQueryKeys = {
  ...announcementEntityKeys,
  home: (params?: Record<string, unknown>) =>
    [...announcementEntityKeys.all, "home", params ?? {}] as const,
  venue: (courtId: string, params?: Record<string, unknown>) =>
    [...announcementEntityKeys.all, "venue", courtId, params ?? {}] as const,
};

const reviewsEntityKeys = createEntityQueryKeys<any>("reviews");

export const queryKeys = {
  courts: courtsQueryKeys,
  organizer: organizerQueryKeys,
  schedule: scheduleQueryKeys,
  announcements: announcementQueryKeys,
  reviews: reviewsEntityKeys,
};
