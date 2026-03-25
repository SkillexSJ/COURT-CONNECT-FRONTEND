import { apiClient } from "@/lib/api-client";
import { buildQueryString } from "@/lib/query/build-query-string";
import type {
  AdminReportsQuery,
  AdminReportResponse,
  AdminUser,
  AdminUserRole,
  AdminUsersQuery,
} from "@/types/admin.types";
import type { ApiResponse, ListApiResponse } from "@/types/response";

export const adminService = {
  getUsers: async (
    query?: AdminUsersQuery,
  ): Promise<ListApiResponse<AdminUser>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ListApiResponse<AdminUser>>(`admin/users${qs}`);
  },

  changeUserRole: async (
    userId: string,
    role: AdminUserRole,
  ): Promise<
    ApiResponse<Pick<AdminUser, "id" | "email" | "name" | "role">>
  > => {
    return apiClient.patch<
      ApiResponse<Pick<AdminUser, "id" | "email" | "name" | "role">>
    >(`admin/users/${encodeURIComponent(userId)}/role`, { role });
  },

  getReports: async (
    query?: AdminReportsQuery,
  ): Promise<ApiResponse<AdminReportResponse>> => {
    const qs = buildQueryString(query);
    return apiClient.get<ApiResponse<AdminReportResponse>>(
      `admin/reports${qs}`,
    );
  },
};
