"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { LayoutGrid, Gauge } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { courtService } from "@/service/court.service";
import { cn } from "@/lib/utils";
import type { CourtListItem } from "@/types/court.types";

type VenuePortfolioPageProps = {
  role: "ORGANIZER" | "ADMIN";
};

// HELPERS
const statusClassMap: Record<string, string> = {
  ACTIVE: "bg-secondary text-primary",
  PENDING_APPROVAL: "bg-amber-100 text-amber-700",
  MAINTENANCE: "bg-muted text-muted-foreground",
  HIDDEN: "bg-red-100 text-red-700",
};

const getVenueHref = (role: "ORGANIZER" | "ADMIN", slug: string) => {
  return role === "ADMIN"
    ? `/admin/venues/${slug}`
    : `/organizer/venues/${slug}/edit`;
};

export default function VenuePortfolioPage({ role }: VenuePortfolioPageProps) {
  const queryClient = useQueryClient();

  // QUERY FOR VENUE PORTFOLIO
  const venuesQuery = useQuery<CourtListItem[]>({
    queryKey: ["venue-portfolio", role],
    queryFn: async () => {
      const response =
        role === "ADMIN"
          ? await courtService.getPendingCourtsForAdmin({ limit: 100 })
          : await courtService.getOrganizerCourts({ limit: 100 });

      return response.data ?? [];
    },
    staleTime: 60_000,
  });

  const venues = venuesQuery.data ?? [];

  // MUTATION FOR UPDATING VENUE STATUS
  const hideVenueMutation = useMutation({
    mutationFn: (courtId: string) => courtService.deleteCourt(courtId),
    onSuccess: async () => {
      toast.success(role === "ADMIN" ? "Venue rejected" : "Venue archived");
      await queryClient.invalidateQueries({
        queryKey: ["venue-portfolio", role],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update venue",
      );
    },
  });

  // HELPERS FOR CALCULATING STATS
  const totalAssets = venues.length;
  const totalBookings = venues.reduce(
    (sum, venue) => sum + (venue._count?.bookings ?? 0),
    0,
  );
  const avgOccupancy =
    totalAssets === 0 ? 0 : Math.round((totalBookings / totalAssets) * 7.5);

  return (
    <div className="space-y-8">
      <header className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start">
        <div className="space-y-3">
          <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
            Venue Portfolio
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {role === "ADMIN"
              ? "Review organizer venues and decide approval status."
              : "Manage your venue portfolio, update details, and keep your listings current."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DashboardStatCard
            label="Total Assets"
            value={String(totalAssets).padStart(2, "0")}
            icon={LayoutGrid}
            subtitle="Venues currently in this portfolio"
          />

          <DashboardStatCard
            label="Avg Occupancy"
            value={`${avgOccupancy}%`}
            icon={Gauge}
            subtitle={`${totalBookings} total bookings across assets`}
            accent
          />
        </div>
      </header>

      {venues.length === 0 && !venuesQuery.isLoading && (
        <Card className="rounded-none border border-border bg-card">
          <CardContent className="p-6 text-sm text-muted-foreground">
            {role === "ADMIN"
              ? "No pending venues found for review."
              : "No venues yet. Add your first venue to start receiving bookings."}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {venues.map((venue) => {
          const heroImage = venue.media?.[0]?.url;
          const venueHref = getVenueHref(role, venue.slug);

          return (
            <Card
              key={venue.id}
              className="rounded-none border border-border bg-card py-0"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,#f1efe7_0%,#e7e4d8_100%)]" />
                )}

                <div className="absolute right-2 top-2">
                  <Badge
                    className={cn(
                      "rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.14em]",
                      statusClassMap[venue.status] ??
                        "bg-muted text-muted-foreground",
                    )}
                  >
                    {venue.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-2xl font-black tracking-tight text-primary">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {venue.locationLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Bookings
                    </p>
                    <p className="font-heading text-lg font-black text-primary">
                      {venue._count?.bookings ?? 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={venueHref} className="flex-1">
                    <Button type="button" className="h-9 w-full rounded-none">
                      <IconEye className="mr-2 size-4" />
                      {role === "ADMIN" ? "Review" : "View Details"}
                    </Button>
                  </Link>

                  {role === "ORGANIZER" && (
                    <Link href={venueHref}>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className="rounded-none"
                      >
                        <IconPencil className="size-4" />
                      </Button>
                    </Link>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="rounded-none text-destructive"
                    onClick={() => hideVenueMutation.mutate(venue.id)}
                    disabled={hideVenueMutation.isPending}
                    title={role === "ADMIN" ? "Reject venue" : "Archive venue"}
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {role === "ORGANIZER" && (
          <Link
            href="/organizer/venues/new"
            className="flex min-h-90 items-center justify-center border border-dashed border-border bg-card p-6 text-center hover:border-primary/35"
          >
            <div className="space-y-2">
              <div className="mx-auto flex size-12 items-center justify-center rounded-sm bg-muted text-primary">
                <IconPlus className="size-5" />
              </div>
              <p className="font-heading text-2xl font-black uppercase tracking-tight text-primary">
                Expand Portfolio
              </p>
              <p className="text-xs text-muted-foreground">
                Add another venue to your management hub.
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
