import type { PaginationMeta } from "@/types/response";

export type BookingStatus = "PENDING" | "PAID" | "CANCELLED" | "COMPLETED";

export type BookingSlot = {
  id: string;
  bookingId: string;
  courtId: string;
  bookingDate: string;
  startMinute: number;
  endMinute: number;
};

export type Booking = {
  id: string;
  bookingCode: string;
  userId: string;
  courtId: string;
  couponId: string | null;
  bookingDate: string;
  status: BookingStatus;
  totalAmount: string | number;
  paymentId: string | null;
  paidAt: string | null;
  expiresAt: string | null; // 24-hour hold expiry time
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  court?: {
    id: string;
    name: string;
    slug: string;
    basePrice: string | number;
    media?: {
      url: string;
      isPrimary?: boolean;
    }[];
  };
  coupon?: {
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: string | number;
  } | null;
  slots?: BookingSlot[];
};

export type CreateBookingPayload = {
  courtId: string;
  bookingDate: string; // YYYY-MM-DD format
  slotTemplateIds: string[];
  couponCode?: string;
};

export type PaymentInitiatePayload = {
  bookingId: string;
};

export type PaymentInitiateResponse = {
  bookingId: string;
  amount: number;
  currency: string;
  paymentIntentId: string;
  clientSecret: string;
  publishableKey: string;
};

export type BookingListResult = {
  data: Booking[];
  meta?: PaginationMeta;
};
