"use client";

import { useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, Clock3, ShieldAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AVATAR_FALLBACK_IMAGE,
  VENUE_FALLBACK_IMAGE,
  getInitials,
} from "@/lib/placeholders";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { BookingService } from "@/service/booking.service";
import { courtService } from "@/service/court.service";

// DYNAMIC IMPORT FOR CHARTS
const OrganizerDashboardCharts = dynamic(
  () =>
    import("./OrganizerDashboardCharts").then(
      (mod) => mod.OrganizerDashboardCharts,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="h-84 animate-pulse rounded-none border border-border bg-card" />
        <div className="h-70 animate-pulse rounded-none border border-border bg-card" />
      </div>
    ),
  },
);

const formatMoney = (value: number) => `USD ${value.toFixed(2)}`;

export default function OrganizerDashboardOverview() {
  // QUERY FOR GETTING COURTS
  const courtsQuery = useQuery({
    queryKey: ["organizer-dashboard-courts"],
    queryFn: () => courtService.getOrganizerCourts({ limit: 100 }),
    staleTime: 30_000,
  });

  const courts = useMemo(
    () => courtsQuery.data?.data ?? [],
    [courtsQuery.data?.data],
  );

  // QUERY FOR GETTING BOOKINGS
  const bookingsQuery = useQuery({
    queryKey: [
      "organizer-dashboard-bookings",
      courts.map((court) => court.id).join("|"),
    ],
    enabled: courts.length > 0,
    queryFn: async () => {
      const responses = await Promise.all(
        courts
          .slice(0, 6)
          .map((court) =>
            BookingService.getCourtBookings(court.id, { limit: 20 }),
          ),
      );
      return responses.flatMap((response) => response.data ?? []);
    },
    staleTime: 20_000,
  });

  const bookings = useMemo(
    () => bookingsQuery.data ?? [],
    [bookingsQuery.data],
  );

  const courtLookup = useMemo(
    () => new Map(courts.map((court) => [court.id, court])),
    [courts],
  );

  const totalEarnings = bookings.reduce((sum, booking) => {
    if (booking.status === "PAID" || booking.status === "COMPLETED") {
      return sum + Number(booking.totalAmount || 0);
    }
    return sum;
  }, 0);

  const activeBookings = bookings.filter(
    (booking) => booking.status === "PENDING" || booking.status === "PAID",
  ).length;
  const pendingVerifications = courts.filter(
    (court) => court.status === "PENDING_APPROVAL",
  ).length;

  const totalVenueBookings = courts.reduce(
    (sum, court) => sum + (court._count?.bookings ?? 0),
    0,
  );
  const occupancyPercent =
    courts.length === 0
      ? 0
      : Math.min(100, Math.round((totalVenueBookings / courts.length) * 8));

  const trendData = useMemo(() => {
    const monthMap = new Map<string, number>();

    for (const booking of bookings) {
      const monthLabel = new Date(booking.bookingDate).toLocaleString("en-US", {
        month: "short",
      });
      monthMap.set(monthLabel, (monthMap.get(monthLabel) ?? 0) + 1);
    }

    return Array.from(monthMap.entries()).map(([month, count]) => ({
      month,
      bookings: count,
    }));
  }, [bookings]);

  const recentBookings = useMemo(
    () =>
      [...bookings]
        .sort(
          (a, b) =>
            new Date(b.bookingDate).getTime() -
            new Date(a.bookingDate).getTime(),
        )
        .slice(0, 6),
    [bookings],
  );

  // HELPERS
  const getVenueName = (booking: (typeof bookings)[number]) => {
    const directName = booking.court?.name?.trim();
    if (directName) return directName;

    const fallbackCourt = courtLookup.get(booking.courtId);
    const fallbackName = fallbackCourt?.name?.trim();
    return fallbackName && fallbackName.length > 0
      ? fallbackName
      : `Court ${booking.courtId.slice(0, 6)}`;
  };

  const getVenueImage = (booking: (typeof bookings)[number]) => {
    const primaryMedia = booking.court?.media?.find((media) => media.isPrimary);
    if (primaryMedia?.url) return primaryMedia.url;
    if (booking.court?.media?.[0]?.url) return booking.court.media[0].url;

    const fallbackCourt = courtLookup.get(booking.courtId);
    const fallbackPrimary = fallbackCourt?.media?.find(
      (media) => media.isPrimary,
    );
    return (
      fallbackPrimary?.url ??
      fallbackCourt?.media?.[0]?.url ??
      VENUE_FALLBACK_IMAGE
    );
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          Management Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Performance insights and real-time operations for your venues.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        <DashboardStatCard
          label="Total Earnings"
          value={formatMoney(totalEarnings)}
          icon={CircleDollarSign}
          subtitle={`${bookings.length} bookings tracked`}
          accent
        />
        <DashboardStatCard
          label="Active Bookings"
          value={String(activeBookings)}
          icon={Clock3}
          subtitle={`Across ${courts.length} listed venues`}
        />
        <DashboardStatCard
          label="Pending Verifications"
          value={String(pendingVerifications)}
          icon={ShieldAlert}
          subtitle="Venue requests waiting admin review"
          className="col-span-2 xl:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-none border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-155">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        No recent bookings found.
                      </TableCell>
                    </TableRow>
                  )}
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm" className="rounded-md">
                            <AvatarImage
                              src={
                                booking.user?.avatarUrl ?? AVATAR_FALLBACK_IMAGE
                              }
                              alt={booking.user?.name ?? "Guest"}
                            />
                            <AvatarFallback className="rounded-md bg-muted text-[10px]">
                              {getInitials(booking.user?.name ?? "Guest")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{booking.user?.name ?? "Guest"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-14 overflow-hidden rounded-sm border border-border/70">
                            <Image
                              src={getVenueImage(booking)}
                              alt={getVenueName(booking)}
                              fill
                              loading="eager"
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <span>{getVenueName(booking)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMoney(Number(booking.totalAmount || 0))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <OrganizerDashboardCharts
          trendData={trendData}
          occupancyPercent={occupancyPercent}
        />
      </div>
    </div>
  );
}
