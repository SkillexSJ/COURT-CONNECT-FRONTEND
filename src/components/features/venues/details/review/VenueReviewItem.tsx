"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AVATAR_FALLBACK_IMAGE } from "@/lib/placeholders";
import type { Review } from "@/types/review.types";
import { authClient } from "@/lib/auth-client";
import { useCreateReviewMutation } from "@/hooks/queries/use-review-mutation";

interface VenueReviewItemProps {
  review: Review;
  isReply?: boolean;
  hostUserId?: string;
}

export default function VenueReviewItem({
  review,
  isReply = false,
  hostUserId,
}: VenueReviewItemProps) {
  // STATES
  const { data: session } = authClient.useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  // MUTATION
  const mutation = useCreateReviewMutation({
    courtId: review.courtId ?? undefined,
    organizerId: review.organizerId ?? undefined,
  });

  // HANDLERS
  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    mutation.mutate(
      {
        courtId: review.courtId ?? undefined,
        organizerId: review.organizerId ?? undefined,
        comment: replyText,
        parentId: review.id,
      },
      {
        onSuccess: () => {
          setIsReplying(false);
          setReplyText("");
        },
      },
    );
  };

  const initials = review.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const isHost = hostUserId && review.user.id === hostUserId;

  return (
    <div
      className={`py-6 space-y-4 ${isReply ? "ml-8 sm:ml-12 pl-4 sm:pl-6 border-l-2 border-primary/10" : "border-b border-primary/10"}`}
    >
      <div className="flex justify-between items-start gap-4">
        {/* User Info Route */}
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm border border-primary/20 shrink-0">
            <AvatarImage
              src={review.user.avatarUrl || AVATAR_FALLBACK_IMAGE}
              alt={review.user.name}
            />
            <AvatarFallback className="bg-primary/5 text-primary font-headline font-black text-base sm:text-lg rounded-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-headline font-black uppercase tracking-tight text-primary text-sm sm:text-base">
                {review.user.name}
              </h4>
              {isHost && (
                <Badge
                  variant="outline"
                  className="text-[9px] sm:text-[10px] uppercase font-bold text-secondary bg-primary border-primary px-1.5 sm:px-2 py-0"
                >
                  Host
                </Badge>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-primary/50 tracking-wider">
              {format(new Date(review.createdAt), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        {/* Rating Stars */}
        {!isReply && review.rating ? (
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  i < review.rating!
                    ? "fill-secondary text-secondary"
                    : "text-primary/20"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-sm text-primary/80 leading-relaxed font-body">
        {review.comment}
      </p>

      {/* Reply Action */}
      {session?.user && !isReplying && (
        <button
          onClick={() => setIsReplying(true)}
          className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-primary/60 hover:text-primary transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Reply
        </button>
      )}

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <textarea
            autoFocus
            rows={2}
            className="w-full bg-surface/50 border border-primary/20 rounded-sm p-3 text-sm text-primary placeholder:text-primary/40 focus:outline-none focus:border-secondary transition-colors resize-none"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            disabled={mutation.isPending}
          />
          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
            <button
              onClick={handleReplySubmit}
              disabled={mutation.isPending || !replyText.trim()}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-secondary text-[10px] font-bold uppercase px-6 py-2 rounded-sm disabled:opacity-50 transition-colors"
            >
              {mutation.isPending ? "..." : "Reply"}
            </button>
            <button
              onClick={() => setIsReplying(false)}
              disabled={mutation.isPending}
              className="flex-1 sm:flex-none bg-surface/50 hover:bg-primary/10 text-primary text-[10px] font-bold uppercase px-6 py-2 border border-primary/10 rounded-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Render Nested Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="mt-4 space-y-2">
          {review.replies.map((reply) => (
            <VenueReviewItem key={reply.id} review={reply} isReply={true} hostUserId={hostUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
