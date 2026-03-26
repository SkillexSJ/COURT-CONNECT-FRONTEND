import type { CourtListItem } from "@/types/court.types";
import type { DaysRangeQuery } from "@/types/shared.types";

export type OrganizerProfilePayload = {
  businessName: string;
  bio?: string;
  website?: string;
  phoneNumber?: string;
  address?: string;
};

export type OrganizerProfile = {
  id: string;
  userId: string;
  businessName: string;
  bio: string | null;
  website: string | null;
  phoneNumber: string | null;
  address: string | null;
  isVerified: boolean;
  stripeAccountId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  _count?: {
    courts: number;
  };
};

export type PublicOrganizer = {
  id: string;
  businessName: string;
  bio: string | null;
  website: string | null;
  address: string | null;
  phoneNumber: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  totalVenues: number;
  totalBookings: number;
  venues: CourtListItem[];
};

export type PublicOrganizerQuery = {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
};

export type UpdateOrganizerProfilePayload = Partial<{
  businessName: string;
  bio: string | null;
  website: string | null;
  phoneNumber: string | null;
  address: string | null;
}>;

export type OrganizerRevenueWindowKey =
  | "LATE_NIGHT"
  | "EARLY_MORNING"
  | "MORNING"
  | "AFTERNOON"
  | "EVENING";

export type OrganizerRevenueBreakdown = {
  rangeDays: number;
  summary: {
    totalRevenue: number;
    paidBookings: number;
    avgBookingValue: number;
  };
  venueBreakdown: Array<{
    courtId: string;
    courtName: string;
    revenue: number;
    bookings: number;
    slotCount: number;
    avgBookingValue: number;
    sharePercent: number;
  }>;
  dayOfWeekBreakdown: Array<{
    dayOfWeek: number;
    label: string;
    revenue: number;
    bookings: number;
    avgBookingValue: number;
  }>;
  slotWindowBreakdown: Array<{
    windowKey: OrganizerRevenueWindowKey;
    label: string;
    revenue: number;
    bookings: number;
    slotCount: number;
    avgSlotValue: number;
  }>;
  heatmap: Array<{
    dayOfWeek: number;
    dayLabel: string;
    windowKey: OrganizerRevenueWindowKey;
    windowLabel: string;
    revenue: number;
    bookings: number;
    slotCount: number;
  }>;
};

export type OrganizerRevenueQuery = DaysRangeQuery;
