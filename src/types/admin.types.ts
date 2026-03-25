import type { DaysRangeQuery, ListQuery, UserRole } from "@/types/shared.types";

export type AdminUserRole = UserRole;

export type AdminUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  role: AdminUserRole;
  phone: string | null;
  avatarUrl: string | null;
  isApproved: boolean;
  createdAt: string;
  organizerProfile?: {
    isVerified: boolean;
  } | null;
  _count?: {
    bookings: number;
  };
  bookings?: {
    id: string;
    bookingDate: string;
    status: "PENDING" | "PAID" | "CANCELLED" | "COMPLETED";
    court: {
      id: string;
      name: string;
    };
  }[];
};

export type AdminReportResponse = {
  rangeDays: number;
  generatedAt: string;
  summary: {
    lifetimeRevenue: number;
    totalBookings: number;
    completedTransactions: number;
    activeOrganizersInRange: number;
    totalOrganizers: number;
    activeCoupons: number;
    expiringCouponsSoon: number;
  };
  statusBreakdown: {
    status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";
    count: number;
  }[];
  monthlyRevenue: {
    monthKey: string;
    monthLabel: string;
    revenue: number;
    bookings: number;
  }[];
  topOrganizers: {
    organizerId: string;
    businessName: string;
    ownerName: string;
    revenue: number;
    paidBookings: number;
    courtCount: number;
  }[];
  courtTypePerformance: {
    courtType: string;
    revenue: number;
    paidBookings: number;
  }[];
  alerts: {
    key: string;
    label: string;
    value: number;
    severity: "LOW" | "MEDIUM" | "HIGH";
  }[];
};

export type AdminUsersQuery = ListQuery & {
  role?: AdminUserRole;
  emailVerified?: boolean;
};

export type AdminReportsQuery = DaysRangeQuery;
