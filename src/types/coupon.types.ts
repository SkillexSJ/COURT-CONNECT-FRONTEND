import type { ListQuery } from "@/types/shared.types";

export type CouponDiscountType = "PERCENTAGE" | "FIXED";

export type Coupon = {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number | string;
  minBookingAmount: number | string | null;
  maxDiscountAmount: number | string | null;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCouponPayload = {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minBookingAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive?: boolean;
};

export type UpdateCouponPayload = Partial<{
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minBookingAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  expiresAt: string | null;
  isActive: boolean;
}>;

export type ValidateCouponResponse = {
  coupon: {
    id: string;
    code: string;
    discountType: CouponDiscountType;
    discountValue: number | string;
  };
  bookingAmount: number;
  discountAmount: number;
  finalAmount: number;
};

export type AdminCouponQuery = ListQuery & {
  discountType?: CouponDiscountType;
  isActive?: boolean;
};
