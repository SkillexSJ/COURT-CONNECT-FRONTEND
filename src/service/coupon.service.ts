import { apiClient, type FetchOptions } from "@/lib/api-client";
import { buildQueryString } from "@/lib/query/build-query-string";
import type { ApiResponse, ListApiResponse } from "@/types/response";
import type {
  AdminCouponQuery,
  Coupon,
  CreateCouponPayload,
  UpdateCouponPayload,
  ValidateCouponResponse,
} from "@/types/coupon.types";

export const couponService = {
  getAdminCoupons: async (
    query?: AdminCouponQuery,
    options?: FetchOptions,
  ): Promise<ListApiResponse<Coupon>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<Coupon>>(`coupons${qs}`, options);
  },

  createCoupon: async (
    payload: CreateCouponPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<Coupon>> => {
    return apiClient.post<ApiResponse<Coupon>>("coupons", payload, options);
  },

  updateCoupon: async (
    couponId: string,
    payload: UpdateCouponPayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<Coupon>> => {
    return apiClient.patch<ApiResponse<Coupon>>(
      `coupons/${encodeURIComponent(couponId)}`,
      payload,
      options,
    );
  },

  deleteCoupon: async (
    couponId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<Coupon>> => {
    return apiClient.delete<ApiResponse<Coupon>>(
      `coupons/${encodeURIComponent(couponId)}`,
      options,
    );
  },

  validateCoupon: async (
    code: string,
    bookingAmount: number,
    options?: FetchOptions,
  ): Promise<ApiResponse<ValidateCouponResponse>> => {
    return apiClient.post<ApiResponse<ValidateCouponResponse>>(
      "coupons/validate",
      { code, bookingAmount },
      options,
    );
  },
};
