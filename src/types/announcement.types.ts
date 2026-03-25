import type { ListQuery } from "@/types/shared.types";

export type AnnouncementType = "INFO" | "MAINTENANCE" | "PROMOTION";

export type AnnouncementAudience = "HOME" | "VENUE";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  audience: AnnouncementAudience;
  createdByRole: "ADMIN" | "ORGANIZER";
  organizerId: string | null;
  courtId: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnnouncementPayload = {
  title: string;
  content: string;
  type?: AnnouncementType;
  imageUrl?: string;
  isPublished?: boolean;
  audience?: AnnouncementAudience;
  courtId?: string;
};

export type UpdateAnnouncementPayload = Partial<{
  title: string;
  content: string;
  type: AnnouncementType;
  imageUrl: string | null;
  isPublished: boolean;
}>;

export type AnnouncementListQuery = ListQuery & {
  type?: AnnouncementType;
  audience?: AnnouncementAudience;
  courtId?: string;
  isPublished?: boolean;
};

export type HomeAnnouncementQuery = ListQuery & {
  type?: AnnouncementType;
};

export type VenueAnnouncementQuery = ListQuery & {
  type?: AnnouncementType;
};
