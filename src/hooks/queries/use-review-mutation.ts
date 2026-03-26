"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewService } from "@/service/review.service";
import { queryKeys } from "@/lib/query/query-keys";
import type {
  CreateReviewPayload,
  UpdateReviewPayload,
} from "@/types/review.types";

export function useCreateReviewMutation(courtIdOrOrganizerIdParams: { courtId?: string; organizerId?: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewService.createReview(payload),
    onSuccess: () => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.list(courtIdOrOrganizerIdParams),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}

export function useUpdateReviewMutation(courtIdOrOrganizerIdParams: { courtId?: string; organizerId?: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: UpdateReviewPayload;
    }) => reviewService.updateReview(reviewId, payload),
    onSuccess: () => {
      toast.success("Review updated successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.list(courtIdOrOrganizerIdParams),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update review");
    },
  });
}

export function useDeleteReviewMutation(courtIdOrOrganizerIdParams: { courtId?: string; organizerId?: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.list(courtIdOrOrganizerIdParams),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
}
