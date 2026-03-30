"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ShieldAlert, UserCheck, Users, Trophy, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { adminService } from "@/service/admin.service";
import { courtService } from "@/service/court.service";
import { useApproveCourtMutation } from "@/hooks/queries/use-court-mutation";
import { toast } from "sonner";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";

// FOR DYNAMIC IMPORT
const AdminDashboardCharts = dynamic(
  () =>
    import("./AdminDashboardCharts").then((mod) => mod.AdminDashboardCharts),
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

export default function AdminDashboardOverview() {
  const approveMutation = useApproveCourtMutation();

  // QUERIES FOR ADMIN DASHBOARD
  const usersQuery = useQuery({
    queryKey: ["admin-dashboard-users"],
    queryFn: () => adminService.getUsers({ limit: 200, sortBy: "-createdAt" }),
    staleTime: 30_000,
  });
  // QUERY FOR PENDING COURTS
  const pendingCourtsQuery = useQuery({
    queryKey: ["admin-dashboard-pending-courts"],
    queryFn: () => courtService.getPendingCourtsForAdmin({ limit: 50 }),
    staleTime: 30_000,
  });

  const topCourtQuery = useQuery({
    queryKey: ["admin-dashboard-top-court"],
    queryFn: async () => {
      const response = await courtService.getAllCourts({ limit: 50 });
      if (!response.data || response.data.length === 0) return null;
      
      const sorted = [...response.data].sort((a,b) => (b._count?.bookings ?? 0) - (a._count?.bookings ?? 0));
      if ((sorted[0]?._count?.bookings ?? 0) === 0) return null;
      
      return sorted[0];
    },
    staleTime: 60_000,
  });

  const topCourt = topCourtQuery.data;

  // MEMOIZED USERS
  const users = useMemo(
    () => usersQuery.data?.data ?? [],
    [usersQuery.data?.data],
  );
  // MEMOIZED PENDING COURTS
  const pendingCourts = useMemo(
    () => pendingCourtsQuery.data?.data ?? [],
    [pendingCourtsQuery.data?.data],
  );

  // MEMOIZED ORGANIZER USERS
  const organizerUsers = users.filter((user) => user.role === "ORGANIZER");
  const approvedOrganizers = organizerUsers.filter(
    (user) => user.isApproved,
  ).length;
  const totalUsers = users.length;
  const totalOrganizers = organizerUsers.length;
  const pendingVerifications = pendingCourts.length;

  const approvalPercent =
    totalOrganizers === 0
      ? 0
      : Math.round((approvedOrganizers / totalOrganizers) * 100);

  // MEMOIZED MONTHLY REGISTRATIONS
  const monthlyRegistrations = useMemo(() => {
    const monthMap = new Map<string, number>();

    for (const user of users) {
      const monthLabel = new Date(user.createdAt).toLocaleString("en-US", {
        month: "short",
      });
      monthMap.set(monthLabel, (monthMap.get(monthLabel) ?? 0) + 1);
    }

    return Array.from(monthMap.entries()).map(([month, count]) => ({
      month,
      registrations: count,
    }));
  }, [users]);

  if (usersQuery.isPending || pendingCourtsQuery.isPending || topCourtQuery.isPending) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          Management Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform insights and verification operations across users and venues.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <DashboardStatCard
          label="Total Users"
          value={String(totalUsers)}
          icon={Users}
          subtitle="Registered platform accounts"
        />
        <DashboardStatCard
          label="Total Organizers"
          value={String(totalOrganizers)}
          icon={UserCheck}
          subtitle={`${approvedOrganizers} approved organizers`}
        />
        <DashboardStatCard
          label="Pending Verifications"
          value={String(pendingVerifications)}
          icon={ShieldAlert}
          subtitle="Venue approvals awaiting review"
          className="col-span-2 md:col-span-1"
          accent
        />
      </div>

      <AdminDashboardCharts
        monthlyRegistrations={monthlyRegistrations}
        approvalPercent={approvalPercent}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-none border border-border bg-card h-fit overflow-hidden">
          <CardHeader>
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Pending Venue Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-155">
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCourts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No pending venue verification requests.
                    </TableCell>
                  </TableRow>
                )}

                {pendingCourts.slice(0, 6).map((court) => (
                  <TableRow key={court.id}>
                    <TableCell>{court.name}</TableCell>
                    <TableCell>
                      {court.organizer?.user?.name ?? "N/A"}
                    </TableCell>
                    <TableCell>{court.locationLabel}</TableCell>
                    <TableCell>
                      {new Date(court.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => {
                          const approvePromise = approveMutation.mutateAsync(
                            court.id,
                          );
                          toast.promise(approvePromise, {
                            loading: `Approving ${court.name}...`,
                            success: `${court.name} approved successfully`,
                            error: "Failed to approve venue",
                          });
                        }}
                        disabled={approveMutation.isPending}
                        className="rounded-sm bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-primary/90 disabled:opacity-50"
                      >
                        Approve
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {topCourt && (
        <Card className="flex h-fit flex-col overflow-hidden rounded-none border border-border bg-card">
          <div className="relative h-32 w-full bg-muted sm:h-40">
            <Image
              src={
                topCourt.media?.find((m) => m.isPrimary)?.url ||
                topCourt.media?.[0]?.url ||
                VENUE_FALLBACK_IMAGE
              }
              alt={topCourt.name}
              fill
              className="object-cover"
            />
            <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
              <Trophy className="h-3.5 w-3.5" />
              Top Venue
            </div>
          </div>
          <CardContent className="flex grow flex-col justify-between p-4">
            <div>
              <h3 className="font-heading text-lg font-black uppercase tracking-tight text-primary">
                {topCourt.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {topCourt.locationLabel}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm font-bold text-primary">
                {topCourt._count?.bookings ?? 0}{" "}
                <span className="font-normal text-muted-foreground">
                  total bookings
                </span>
              </div>
              <Link
                href={`/venues/${topCourt.slug}`}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary transition-colors hover:text-secondary hover:underline"
              >
                View <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
