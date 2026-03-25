import { apiClient } from "@/lib/api-client";
import {
  BookingListResult,
  Booking,
  CreateBookingPayload,
  PaymentInitiatePayload,
  PaymentInitiateResponse,
} from "@/types/booking.types";
import type { ApiResponse, ListApiResponse } from "@/types/response";
import type { QueryParamsRecord } from "@/types/shared.types";

export const BookingService = {
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>(
      "/bookings",
      payload,
    );
    return response.data;
  },

  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await apiClient.get<ApiResponse<Booking>>(
      `/bookings/${bookingId}`,
    );
    return response.data;
  },

  async getUserBookings(
    queryParams?: QueryParamsRecord,
  ): Promise<BookingListResult> {
    const params = new URLSearchParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    const url = `/bookings/my${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<ListApiResponse<Booking>>(url);

    return {
      data: response.data ?? [],
      meta: response.meta,
    };
  },

  async getCourtBookings(
    courtId: string,
    queryParams?: QueryParamsRecord,
  ): Promise<BookingListResult> {
    const params = new URLSearchParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    const url = `/bookings/court/${courtId}${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<ListApiResponse<Booking>>(url);

    return {
      data: response.data ?? [],
      meta: response.meta,
    };
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    const response = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/${bookingId}/cancel`,
      {},
    );
    return response.data;
  },

  async approveBooking(bookingId: string): Promise<Booking> {
    const response = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/${bookingId}/approve`,
      {},
    );
    return response.data;
  },

  async rejectBooking(bookingId: string, reason?: string): Promise<Booking> {
    const response = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/${bookingId}/reject`,
      { reason },
    );
    return response.data;
  },

  async initiatePayment(
    payload: PaymentInitiatePayload,
  ): Promise<PaymentInitiateResponse> {
    const response = await apiClient.post<ApiResponse<PaymentInitiateResponse>>(
      "/payments/initiate",
      payload,
    );
    return response.data;
  },
};
