import type { UserRole } from "@/types/shared.types";

export type ReviewUserSummary = {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
};

export type Review = {
  id: string;
  userId: string;
  courtId: string | null;
  organizerId: string | null;
  rating: number | null;
  comment: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: ReviewUserSummary;
  replies?: Review[];
};

export type CreateReviewPayload = {
  courtId?: string;
  organizerId?: string;
  rating?: number;
  comment: string;
  parentId?: string;
};

export type UpdateReviewPayload = {
  rating?: number;
  comment?: string;
};

export type ReviewQueryParams = {
  courtId?: string;
  organizerId?: string;
  page?: number;
  limit?: number;
  sort?: string;
};
