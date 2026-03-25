import { apiClient, type FetchOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/response";
import type { UpdateUserProfilePayload, UserProfile } from "@/types/user.types";

export const userService = {
  getProfile: async (
    options?: FetchOptions,
  ): Promise<ApiResponse<UserProfile>> => {
    return apiClient.get<ApiResponse<UserProfile>>("users/me", options);
  },

  updateProfile: async (
    payload: UpdateUserProfilePayload,
    options?: FetchOptions,
  ): Promise<ApiResponse<UserProfile>> => {
    return apiClient.patch<ApiResponse<UserProfile>>(
      "users/me",
      payload,
      options,
    );
  },

  uploadAvatar: async (
    file: File,
    options?: FetchOptions,
  ): Promise<
    ApiResponse<
      Pick<UserProfile, "id" | "name" | "email" | "role" | "avatarUrl">
    >
  > => {
    const formData = new FormData();
    formData.append("avatar", file);

    return apiClient.patch<
      ApiResponse<
        Pick<UserProfile, "id" | "name" | "email" | "role" | "avatarUrl">
      >
    >("users/me/avatar", formData, options);
  },
};
