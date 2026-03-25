import { apiClient, type FetchOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/response";
import type {
  AvailableSlot,
  CreateSlotTemplatePayload,
  SlotTemplate,
  SlotTemplatesByDay,
  UpdateSlotTemplatePayload,
} from "@/types/schedule.types";

const encodeDateParam = (date: string | Date) => {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }
  return date;
};

export const scheduleService = {
  createSlotTemplate: async (
    courtId: string,
    payload: CreateSlotTemplatePayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<SlotTemplate>> => {
    return apiClient.post<ApiResponse<SlotTemplate>>(
      `courts/${encodeURIComponent(courtId)}/schedules`,
      payload,
      options,
    );
  },

  /**
   * GET
   *
   */
  getSlotTemplates: async (
    courtId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<SlotTemplatesByDay>> => {
    return apiClient.get<ApiResponse<SlotTemplatesByDay>>(
      `courts/${encodeURIComponent(courtId)}/schedules`,
      options,
    );
  },

  /**
   * GET /api/courts/:courtId/availability?date=YYYY-MM-DD
   * Public available slots for the given date.
   */
  getAvailableSlots: async (
    courtId: string,
    date: string | Date,
    options?: FetchOptions,
  ): Promise<ApiResponse<AvailableSlot[]>> => {
    const dateParam = encodeURIComponent(encodeDateParam(date));

    return apiClient.get<ApiResponse<AvailableSlot[]>>(
      `courts/${encodeURIComponent(courtId)}/availability?date=${dateParam}`,
      options,
    );
  },

  /**
   * PATCH /api/schedules/:templateId
   * Update a slot template (organizer/admin).
   */
  updateSlotTemplate: async (
    templateId: string,
    payload: UpdateSlotTemplatePayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<SlotTemplate>> => {
    return apiClient.patch<ApiResponse<SlotTemplate>>(
      `schedules/${encodeURIComponent(templateId)}`,
      payload,
      options,
    );
  },

  /**
   * DELETE /api/schedules/:templateId
   * Soft-deactivate a slot template.
   */
  deleteSlotTemplate: async (
    templateId: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<SlotTemplate>> => {
    return apiClient.delete<ApiResponse<SlotTemplate>>(
      `schedules/${encodeURIComponent(templateId)}`,
      options,
    );
  },
};
