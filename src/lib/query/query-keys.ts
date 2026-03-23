import type { CourtQueryParams } from "@/types/court.types";
import { createEntityQueryKeys } from "@/lib/query/query-key-factory";

const courtsEntityKeys = createEntityQueryKeys<CourtQueryParams>("courts");
const organizerEntityKeys = createEntityQueryKeys("organizer");
const scheduleEntityKeys = createEntityQueryKeys("schedule");

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

export const queryKeys = {
  courts: courtsQueryKeys,
  organizer: organizerQueryKeys,
  schedule: scheduleQueryKeys,
};
