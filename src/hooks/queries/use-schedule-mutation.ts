"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { invalidateEntityList } from "@/lib/query/query-invalidation";
import { queryKeys } from "@/lib/query/query-keys";
import { scheduleService } from "@/service/schedule.service";
import type { ApiResponse } from "@/types/response";
import type {
  CreateSlotTemplatePayload,
  SlotTemplate,
  SlotTemplatesByDay,
  UpdateSlotTemplatePayload,
} from "@/types/schedule.types";

type CreateSlotTemplateInput = {
  courtId: string;
  payload: CreateSlotTemplatePayload;
};

type UpdateSlotTemplateInput = {
  courtId: string;
  templateId: string;
  payload: UpdateSlotTemplatePayload;
};

type DeleteSlotTemplateInput = {
  courtId: string;
  templateId: string;
};

type ScheduleMutationContext = {
  previousTemplates?: ApiResponse<SlotTemplatesByDay>;
};

const updateTemplateInGroupedData = (
  groupedData: SlotTemplatesByDay,
  templateId: string,
  payload: UpdateSlotTemplatePayload,
): SlotTemplatesByDay => {
  return Object.fromEntries(
    Object.entries(groupedData).map(([day, templates]) => [
      day,
      templates.map((template) =>
        template.id === templateId ? { ...template, ...payload } : template,
      ),
    ]),
  );
};

const removeTemplateFromGroupedData = (
  groupedData: SlotTemplatesByDay,
  templateId: string,
): SlotTemplatesByDay => {
  return Object.fromEntries(
    Object.entries(groupedData).map(([day, templates]) => [
      day,
      templates.filter((template) => template.id !== templateId),
    ]),
  );
};

const appendTemplateToGroupedData = (
  groupedData: SlotTemplatesByDay,
  template: SlotTemplate,
): SlotTemplatesByDay => {
  const dayKey = String(template.dayOfWeek);
  const currentTemplates = groupedData[dayKey] ?? [];

  return {
    ...groupedData,
    [dayKey]: [...currentTemplates, template],
  };
};

export function useCreateSlotTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courtId, payload }: CreateSlotTemplateInput) =>
      scheduleService.createSlotTemplate(courtId, payload),
    onSuccess: async (response, variables) => {
      const key = queryKeys.schedule.templates(variables.courtId);

      queryClient.setQueryData<ApiResponse<SlotTemplatesByDay> | undefined>(
        key,
        (current) => {
          if (!current) return current;
          return {
            ...current,
            data: appendTemplateToGroupedData(current.data, response.data),
          };
        },
      );

      await invalidateEntityList(queryClient, key);
    },
  });
}

export function useUpdateSlotTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SlotTemplate>,
    Error,
    UpdateSlotTemplateInput,
    ScheduleMutationContext
  >({
    mutationFn: ({ templateId, payload }) =>
      scheduleService.updateSlotTemplate(templateId, payload),
    onMutate: async (variables) => {
      const key = queryKeys.schedule.templates(variables.courtId);
      await queryClient.cancelQueries({ queryKey: key });

      const previousTemplates =
        queryClient.getQueryData<ApiResponse<SlotTemplatesByDay>>(key);

      queryClient.setQueryData<ApiResponse<SlotTemplatesByDay> | undefined>(
        key,
        (current) => {
          if (!current) return current;
          return {
            ...current,
            data: updateTemplateInGroupedData(
              current.data,
              variables.templateId,
              variables.payload,
            ),
          };
        },
      );

      return { previousTemplates };
    },
    onError: (_error, variables, context) => {
      if (!context?.previousTemplates) return;
      queryClient.setQueryData(
        queryKeys.schedule.templates(variables.courtId),
        context.previousTemplates,
      );
    },
    onSettled: async (_result, _error, variables) => {
      await invalidateEntityList(
        queryClient,
        queryKeys.schedule.templates(variables.courtId),
      );
    },
  });
}

export function useDeleteSlotTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SlotTemplate>,
    Error,
    DeleteSlotTemplateInput,
    ScheduleMutationContext
  >({
    mutationFn: ({ templateId }) =>
      scheduleService.deleteSlotTemplate(templateId),
    onMutate: async (variables) => {
      const key = queryKeys.schedule.templates(variables.courtId);
      await queryClient.cancelQueries({ queryKey: key });

      const previousTemplates =
        queryClient.getQueryData<ApiResponse<SlotTemplatesByDay>>(key);

      queryClient.setQueryData<ApiResponse<SlotTemplatesByDay> | undefined>(
        key,
        (current) => {
          if (!current) return current;
          return {
            ...current,
            data: removeTemplateFromGroupedData(
              current.data,
              variables.templateId,
            ),
          };
        },
      );

      return { previousTemplates };
    },
    onError: (_error, variables, context) => {
      if (!context?.previousTemplates) return;
      queryClient.setQueryData(
        queryKeys.schedule.templates(variables.courtId),
        context.previousTemplates,
      );
    },
    onSettled: async (_result, _error, variables) => {
      await invalidateEntityList(
        queryClient,
        queryKeys.schedule.templates(variables.courtId),
      );
    },
  });
}
