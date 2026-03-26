"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { invalidateEntityList } from "@/lib/query/query-invalidation";
import { queryKeys } from "@/lib/query/query-keys";
import { courtService } from "@/service/court.service";
import type {
  CourtListItem,
  CreateCourtPayload,
  UpdateCourtPayload,
} from "@/types/court.types";
import type { ApiResponse, ListApiResponse } from "@/types/response";

type UpdateCourtInput = {
  courtId: string;
  payload: UpdateCourtPayload;
};

type DeleteCourtInput = {
  courtId: string;
};

type DeleteCourtMutationContext = {
  previousLists: Array<
    readonly [readonly unknown[], ListApiResponse<CourtListItem> | undefined]
  >;
};

export function useCreateCourtMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCourtPayload) =>
      courtService.createCourt(payload),
    onSuccess: async () => {
      await invalidateEntityList(queryClient, queryKeys.courts.lists());
    },
  });
}

export function useUpdateCourtMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courtId, payload }: UpdateCourtInput) =>
      courtService.updateCourt(courtId, payload),
    onSuccess: async () => {
      await invalidateEntityList(queryClient, queryKeys.courts.lists());
    },
  });
}

export function useDeleteCourtMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CourtListItem>,
    Error,
    DeleteCourtInput,
    DeleteCourtMutationContext
  >({
    mutationFn: ({ courtId }) => courtService.deleteCourt(courtId),
    onMutate: async ({ courtId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.courts.lists() });

      const previousLists = queryClient.getQueriesData<
        ListApiResponse<CourtListItem>
      >({
        queryKey: queryKeys.courts.lists(),
      });

      for (const [key] of previousLists) {
        queryClient.setQueryData<ListApiResponse<CourtListItem> | undefined>(
          key,
          (current) => {
            if (!current) return current;

            return {
              ...current,
              data: current.data.filter((court) => court.id !== courtId),
            };
          },
        );
      }

      return { previousLists };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;

      for (const [key, data] of context.previousLists) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: async () => {
      await invalidateEntityList(queryClient, queryKeys.courts.lists());
    },
  });
}

export function useApproveCourtMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courtId: string) => courtService.approveCourtByAdmin(courtId),
    onSuccess: async () => {
      await invalidateEntityList(queryClient, queryKeys.courts.lists());
      await queryClient.invalidateQueries({
        queryKey: ["admin-dashboard-pending-courts"],
      });
    },
  });
}
