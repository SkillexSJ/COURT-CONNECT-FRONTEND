import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/response";

export const aiService = {
  generateDescription: async (payload: { name: string; type: string; locationLabel: string }) => {
    return apiClient.post<ApiResponse<{ description: string }>>("ai/generate-description", payload);
  },
};
