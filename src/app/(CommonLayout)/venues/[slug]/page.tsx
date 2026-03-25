"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { courtService } from "@/service/court.service";
import VenueDetails from "@/components/features/venues/details/VenueDetails";
import { queryKeys } from "@/lib/query/query-keys";
import { QUERY_STALE_TIME } from "@/lib/query/query-defaults";
import Loading from "@/app/loading";

export default function VenueDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Fetch venue details by slug
  const {
    data: venueResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.courts.detail(slug),
    queryFn: () => courtService.getCourtBySlug(slug),
    staleTime: QUERY_STALE_TIME.default,
    enabled: Boolean(slug),
  });

  const venue = venueResponse?.data;

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (error || !venue) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-8">
          <h1 className="text-3xl font-headline font-black text-primary uppercase">
            Venue Not Found
          </h1>
          <p className="text-primary/60 font-body">
            {error instanceof Error
              ? error.message
              : "The venue you are looking for does not exist or has been removed."}
          </p>
          <a
            href="/venues"
            className="inline-block mt-6 bg-primary text-secondary px-8 py-3 font-headline font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-primary/90 transition-colors"
          >
            Back to Venues
          </a>
        </div>
      </div>
    );
  }

  return <VenueDetails venue={venue} />;
}
