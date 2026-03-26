"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconCheck, IconUserDown } from "@tabler/icons-react";
import { UserCheck, Users, UserRoundPlus } from "lucide-react";
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
import type { AdminUser } from "@/types/admin.types";

/**
 * THIS IS A ROBUST ORGANIZER MANAGEMENT TABLE FOR ADMINS
 */

type FilterMode = "ALL" | "ORGANIZER" | "CANDIDATES";

export default function OrganizerManagementTable() {
  const queryClient = useQueryClient();
  // STATES
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ORGANIZER");

  // QUERIES
  const usersQuery = useQuery({
    queryKey: ["admin-users-management", search],
    queryFn: () =>
      adminService.getUsers({
        limit: 200,
        searchTerm: search.trim() || undefined,
        sortBy: "-createdAt",
      }),
    staleTime: 30_000,
  });

  // MEMOIZED VALUES
  const allUsers = useMemo(
    () => usersQuery.data?.data ?? [],
    [usersQuery.data?.data],
  );

  const manageableUsers = useMemo(
    () => allUsers.filter((user) => user.role !== "ADMIN"),
    [allUsers],
  );

  const rows = useMemo(() => {
    if (filterMode === "ALL") {
      return manageableUsers.filter((user) => user.role === "ORGANIZER");
    }

    if (filterMode === "ORGANIZER") {
      return manageableUsers.filter((user) => user.role === "ORGANIZER");
    }

    return manageableUsers.filter(
      (user) => user.role === "USER" && Boolean(user.organizerProfile),
    );
  }, [manageableUsers, filterMode]);

  const organizerCount = manageableUsers.filter(
    (user) => user.role === "ORGANIZER",
  ).length;
  const candidatesCount = manageableUsers.filter(
    (user) => user.role === "USER" && Boolean(user.organizerProfile),
  ).length;

  // MUTATIONS
  const changeRoleMutation = useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: AdminUser["role"];
    }) => adminService.changeUserRole(userId, role),
    onSuccess: async (_result, variables) => {
      if (variables.role === "ORGANIZER") {
        toast.success("Organizer verified");
      } else {
        toast.success("Organizer demoted to user");
      }

      await queryClient.invalidateQueries({
        queryKey: ["admin-users-management"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update role",
      );
    },
  });

  // HANDLERS
  const handleMakeOrganizer = (userId: string) => {
    changeRoleMutation.mutate({ userId, role: "ORGANIZER" });
  };

  const handleMakeUser = (userId: string) => {
    changeRoleMutation.mutate({ userId, role: "USER" });
  };

  /**
   * MAIN UI COMPONENT
   */

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          Organizer Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage organizer verification and role transitions based on backend
          admin controls.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Total Users"
          value={String(manageableUsers.length)}
          icon={Users}
          subtitle="Non-admin accounts in this list"
        />
        <DashboardStatCard
          label="Organizers"
          value={String(organizerCount)}
          icon={UserCheck}
          subtitle="Currently assigned organizer role"
        />
        <DashboardStatCard
          label="Verification Candidates"
          value={String(candidatesCount)}
          icon={UserRoundPlus}
          subtitle="Ready for organizer promotion"
          accent
        />
      </div>

      <Card className="rounded-none border border-border bg-card">
        <CardHeader className="space-y-3">
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Organizers Table
          </CardTitle>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              {(
                [
                  { key: "ORGANIZER", label: "Organizers" },
                  { key: "CANDIDATES", label: "Candidates" },
                  { key: "ALL", label: "All" },
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
                  <TableHead>Verified</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {usersQuery.isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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
                      colSpan={7}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No users found for this filter.
                    </TableCell>
                  </TableRow>
                )}

                {!usersQuery.isLoading &&
                  rows.map((user) => {
                    const isOrganizer = user.role === "ORGANIZER";
                    const verifiedStatus = isOrganizer
                      ? Boolean(user.organizerProfile?.isVerified)
                      : false;
                    const roleLabel = "Organizer";

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-semibold text-primary">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone ?? "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.14em]",
                              isOrganizer
                                ? "bg-secondary text-primary"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {roleLabel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.14em]",
                              verifiedStatus
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700",
                            )}
                          >
                            {verifiedStatus ? "Verified" : "Not Verified"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user._count?.bookings ?? 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            {!isOrganizer && (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="rounded-none"
                                disabled={changeRoleMutation.isPending}
                                onClick={() => handleMakeOrganizer(user.id)}
                              >
                                <IconCheck className="size-3.5" />
                                Verify
                              </Button>
                            )}

                            {isOrganizer && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-none"
                                disabled={changeRoleMutation.isPending}
                                onClick={() => handleMakeUser(user.id)}
                              >
                                <IconUserDown className="size-3.5" />
                                Demote
                              </Button>
                            )}
                          </div>
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
