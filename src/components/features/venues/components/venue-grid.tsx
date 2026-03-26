import { Button } from "@/components/ui/button";
import type { CourtListItem } from "@/types/court.types";

import { VenueCard } from "./venue-card";

export type VenueGridView = "grid" | "map";

type VenueGridProps = {
  courts: CourtListItem[];
  view: VenueGridView;
  isLoading: boolean;
  isError: boolean;
  pageLimit: number;
  onRetry: () => void;
};

export function VenueGrid({
  courts,
  view,
  isLoading,
  isError,
  pageLimit,
  onRetry,
}: VenueGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: pageLimit }).map((_, idx) => (
          <div
            key={idx}
            className="h-90 animate-pulse border border-border bg-muted/30"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-sm border border-destructive/20 bg-destructive/5 p-6">
        <p className="text-sm font-medium text-destructive">
          Unable to load venues right now.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Please retry. If this continues, check API connectivity.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="rounded-sm border border-border bg-card p-10 text-center">
        <p className="text-lg font-semibold text-foreground">No venues found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Adjust your filters to discover more arenas.
        </p>
      </div>
    );
  }

  if (view === "map") {
    return (
      <div className="space-y-4 rounded-sm border border-border bg-card p-4">
        <div className="rounded-sm border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
          Map integration can be plugged here later. For now, this view lists
          coordinate-enabled venues first.
        </div>

        <div className="space-y-3">
          {[...courts]
            .sort(
              (a, b) =>
                Number(Boolean(b.latitude && b.longitude)) -
                Number(Boolean(a.latitude && a.longitude)),
            )
            .map((court) => (
              <div
                key={court.id}
                className="flex flex-col gap-3 rounded-sm border border-border/70 bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {court.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {court.locationLabel}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Coordinates: {court.latitude ?? "N/A"},{" "}
                    {court.longitude ?? "N/A"}
                  </p>
                </div>

                <Button size="sm" variant="outline" type="button">
                  Open
                </Button>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {courts.map((court) => (
        <VenueCard key={court.id} court={court} />
      ))}
    </div>
  );
}
