"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { invalidateEntityList } from "@/lib/query/query-invalidation";
import { queryKeys } from "@/lib/query/query-keys";
import { organizerService } from "@/service/organizer.service";
import type { OrganizerProfilePayload } from "@/types/organizer.types";

/**
 *
 * Organizer-related mutations, including creating and updating organizer profiles.
 */

export function useCreateOrganizerProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrganizerProfilePayload) =>
      organizerService.createProfile(payload),
    onSuccess: async (response) => {
      queryClient.setQueryData(queryKeys.organizer.profile, response);
      await invalidateEntityList(queryClient, queryKeys.organizer.all);
    },
  });
}
