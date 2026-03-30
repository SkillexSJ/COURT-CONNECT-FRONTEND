"use client";

import { useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck2, CircleDollarSign, Clock3, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { BookingService } from "@/service/booking.service";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";

import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";

// DYNAMIC IMPORT FOR USER DASHBOARD CHARTS
const UserDashboardCharts = dynamic(
  () => import("./UserDashboardCharts").then((mod) => mod.UserDashboardCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="h-84 animate-pulse rounded-none border border-border bg-card" />
        <div className="h-84 animate-pulse rounded-none border border-border bg-card" />
      </div>
    ),
  },
);

const formatMoney = (value: number) => `USD ${value.toFixed(2)}`;

// HELPER FUNCTIONS
const getVenueName = (booking: {
  court?: { name?: string | null };
  courtId: string;
}) => {
  const name = booking.court?.name?.trim();
  return name && name.length > 0
    ? name
    : `Court ${booking.courtId.slice(0, 6)}`;
};

const getVenueImage = (booking: {
  court?: { media?: { url: string; isPrimary?: boolean }[] };
}) => {
  const primaryMedia = booking.court?.media?.find((media) => media.isPrimary);
  return (
    primaryMedia?.url ?? booking.court?.media?.[0]?.url ?? VENUE_FALLBACK_IMAGE
  );
};

export default function UserDashboardOverview() {
  // QUERY FOR USER BOOKINGS
  const bookingsQuery = useQuery({
    queryKey: ["user-dashboard-bookings"],
    queryFn: () => BookingService.getUserBookings({ limit: 100 }),
    staleTime: 30_000,
  });

  const bookings = useMemo(
    () => bookingsQuery.data?.data ?? [],
    [bookingsQuery.data?.data],
  );

  // CALCULATING STATS
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (booking) => booking.status === "PENDING" || booking.status === "PAID",
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  // USEMEMO FOR TOTAL SPENT
  const totalSpent = useMemo(() => {
    return bookings.reduce((sum, booking) => {
      if (booking.status === "PAID" || booking.status === "COMPLETED") {
        return sum + Number(booking.totalAmount || 0);
      }
      return sum;
    }, 0);
  }, [bookings]);

  // USEMEMO FOR COMPLETION PERCENTAGE
  const completionPercent =
    totalBookings === 0
      ? 0
      : Math.round((completedBookings / totalBookings) * 100);

  // USEMEMO FOR TREND DATA
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

  // USEMEMO FOR RECENT BOOKINGS
  const recentBookings = useMemo(
    () =>
      [...bookings]
        .sort(
          (a, b) =>
            new Date(b.bookingDate).getTime() -
            new Date(a.bookingDate).getTime(),
        )
        .slice(0, 5),
    [bookings],
  );

  if (bookingsQuery.isPending) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          Management Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Personal booking insights and real-time activity snapshots.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        <DashboardStatCard
          label="Total Bookings"
          value={String(totalBookings)}
          icon={CalendarCheck2}
          subtitle="All-time booking count"
        />
        <DashboardStatCard
          label="Active Bookings"
          value={String(activeBookings)}
          icon={Clock3}
          subtitle="Pending and paid reservations"
        />
        <DashboardStatCard
          label="Completed"
          value={String(completedBookings)}
          icon={Trophy}
          subtitle={`${completionPercent}% completion rate`}
        />
        <DashboardStatCard
          label="Total Spent"
          value={formatMoney(totalSpent)}
          icon={CircleDollarSign}
          subtitle="From paid and completed bookings"
          accent
        />
      </div>

      <UserDashboardCharts
        trendData={trendData}
        completionPercent={completionPercent}
      />

      <Card className="rounded-none border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-140">
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>{booking.status}</TableCell>
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
    </div>
  );
}
