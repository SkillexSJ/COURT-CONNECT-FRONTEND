"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { IconCheck } from "@tabler/icons-react";
import { Users, CalendarCheck2, CircleDollarSign } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { cn } from "@/lib/utils";
import { adminService } from "@/service/admin.service";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";

type FilterMode = "ALL_USERS" | "ACTIVE_BOOKERS" | "NO_BOOKINGS";

export default function UserManagementTable() {
  const queryClient = useQueryClient();

  // STATES
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL_USERS");

  // QUERIES
  const usersQuery = useQuery({
    queryKey: ["admin-user-role-management", search],
    queryFn: () =>
      adminService.getUsers({
        limit: 300,
        role: "USER",
        searchTerm: search.trim() || undefined,
        sortBy: "-createdAt",
      }),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  // MEMOIZED VALUES FOR USERS
  const users = useMemo(
    () => usersQuery.data?.data ?? [],
    [usersQuery.data?.data],
  );

  // MEMOIZED VALUES
  const rows = useMemo(() => {
    if (filterMode === "ALL_USERS") return users;
    if (filterMode === "ACTIVE_BOOKERS") {
      return users.filter((user) => (user._count?.bookings ?? 0) > 0);
    }
    return users.filter((user) => (user._count?.bookings ?? 0) === 0);
  }, [users, filterMode]);

  const totalBookings = users.reduce(
    (sum, user) => sum + (user._count?.bookings ?? 0),
    0,
  );
  const activeBookerCount = users.filter(
    (user) => (user._count?.bookings ?? 0) > 0,
  ).length;

  // MUTATIONS

  const promoteMutation = useMutation({
    mutationFn: (userId: string) =>
      adminService.changeUserRole(userId, "ORGANIZER"),
    onSuccess: async () => {
      toast.success("User promoted to organizer");
      await queryClient.invalidateQueries({
        queryKey: ["admin-user-role-management"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to promote user",
      );
    },
  });

  /**
   * MAIN UI COMPONENT
   */
  if (usersQuery.isPending) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage USER-role accounts, review booking activity, and track
          currently connected venues.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Total Users"
          value={String(users.length)}
          icon={Users}
          subtitle="Accounts with USER role"
        />
        <DashboardStatCard
          label="Active Bookers"
          value={String(activeBookerCount)}
          icon={CalendarCheck2}
          subtitle="Users with at least one booking"
        />
        <DashboardStatCard
          label="Total Bookings"
          value={String(totalBookings)}
          icon={CircleDollarSign}
          subtitle="Bookings linked to USER accounts"
          accent
        />
      </div>

      <Card className="rounded-none border border-border bg-card">
        <CardHeader className="space-y-3">
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Users Table
          </CardTitle>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              {(
                [
                  { key: "ALL_USERS", label: "All Users" },
                  { key: "ACTIVE_BOOKERS", label: "Active Bookers" },
                  { key: "NO_BOOKINGS", label: "No Bookings" },
                ] as const
              ).map((item) => (
                <Button
                  key={item.key}
                  type="button"
                  variant={filterMode === item.key ? "secondary" : "outline"}
                  className={cn(
                    "rounded-none",
                    filterMode === item.key && "text-primary",
                  )}
                  onClick={() => setFilterMode(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone"
              className="h-9 w-full rounded-none md:w-72"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-none border border-border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Connected Venue</TableHead>
                  <TableHead>Last Booking</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {usersQuery.isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <LoadingSpinner
                        label="Loading users..."
                        className="justify-center"
                      />
                    </TableCell>
                  </TableRow>
                )}

                {!usersQuery.isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No user records found for this filter.
                    </TableCell>
                  </TableRow>
                )}

                {!usersQuery.isLoading &&
                  rows.map((user) => {
                    const bookingsCount = user._count?.bookings ?? 0;
                    const latestBooking = user.bookings?.[0];
                    const connectedVenue =
                      latestBooking?.court?.name ?? "Not connected";

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-semibold text-primary">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone ?? "N/A"}</TableCell>
                        <TableCell>
                          <Badge className="rounded-none bg-muted px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            USER
                          </Badge>
                        </TableCell>
                        <TableCell>{bookingsCount}</TableCell>
                        <TableCell className="font-medium text-foreground">
                          {connectedVenue}
                        </TableCell>
                        <TableCell>
                          {latestBooking?.bookingDate
                            ? format(
                                new Date(latestBooking.bookingDate),
                                "MMM dd, yyyy",
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="rounded-none"
                            disabled={promoteMutation.isPending}
                            onClick={() => promoteMutation.mutate(user.id)}
                          >
                            <IconCheck className="size-3.5" />
                            Make Organizer
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
