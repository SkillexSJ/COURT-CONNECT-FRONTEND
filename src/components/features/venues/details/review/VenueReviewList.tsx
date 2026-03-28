"use client";

import type { Review } from "@/types/review.types";
import VenueReviewItem from "./VenueReviewItem";

interface VenueReviewListProps {
  reviews: Review[];
  hostUserId?: string;
}

export default function VenueReviewList({ reviews, hostUserId }: VenueReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center border-t border-primary/10 mt-8">
        <p className="text-primary/60 font-body">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between border-b border-primary/10 pb-4">
        <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary/60">
          Latest Feedback
        </h4>
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1 cursor-pointer">
          Sort by: Most Recent <span className="text-primary/60 mb-[2px]">⌄</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {reviews.map((review) => (
          <VenueReviewItem key={review.id} review={review} hostUserId={hostUserId} />
        ))}
      </div>
    </div>
  );
}
