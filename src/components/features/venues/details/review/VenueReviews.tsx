"use client";

import { useReviewsQuery } from "@/hooks/queries/use-reviews-query";
import VenueReviewStats from "./VenueReviewStats";
import VenueReviewForm from "./VenueReviewForm";
import VenueReviewList from "./VenueReviewList";

interface VenueReviewsProps {
  courtId: string;
  hostUserId?: string;
}

export default function VenueReviews({ courtId, hostUserId }: VenueReviewsProps) {
  // QUERY FOR REVIEWS
  const { data, isLoading } = useReviewsQuery({
    courtId,
    limit: 100,
    sort: "-createdAt",
  });

  const reviews = data?.data ?? [];

  return (
    <section className="space-y-8 sm:space-y-10">
      <div className="flex items-center gap-3 sm:gap-4">
        <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl sm:tracking-tighter">
          Reviews & Community
        </h2>
        <div className="h-0.5 grow bg-primary/15" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Stats Display */}
        {isLoading ? (
          <div className="h-[300px] animate-pulse bg-primary/5 rounded-sm border border-primary/10" />
        ) : (
          <VenueReviewStats reviews={reviews} />
        )}

        {/* Right Form Display */}
        <VenueReviewForm courtId={courtId} />
      </div>

      {/* List Display */}
      {isLoading ? (
        <div className="space-y-4 mt-8">
          <div className="h-24 animate-pulse bg-primary/5 rounded-sm" />
          <div className="h-24 animate-pulse bg-primary/5 rounded-sm" />
        </div>
      ) : (
        <VenueReviewList reviews={reviews} hostUserId={hostUserId} />
      )}
    </section>
  );
}
