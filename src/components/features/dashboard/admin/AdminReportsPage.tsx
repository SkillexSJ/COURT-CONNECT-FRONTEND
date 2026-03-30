"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  CircleDollarSign,
  Layers,
} from "lucide-react";

import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminService } from "@/service/admin.service";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";

const money = (value: number) => `USD ${value.toFixed(2)}`;

// FOR DYNAMIC IMPORT
const AdminReportsCharts = dynamic(
  () => import("./AdminReportsCharts").then((mod) => mod.AdminReportsCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="h-96 animate-pulse rounded-none border border-border bg-card" />
        <div className="h-96 animate-pulse rounded-none border border-border bg-card" />
      </div>
    ),
  },
);

const rangeOptions = [
  { label: "90D", value: 90 },
  { label: "180D", value: 180 },
  { label: "365D", value: 365 },
] as const;

// HELPERS
const severityToVariant = (severity: "LOW" | "MEDIUM" | "HIGH") => {
  if (severity === "HIGH") return "destructive" as const;
  if (severity === "MEDIUM") return "secondary" as const;
  return "outline" as const;
};

export default function AdminReportsPage() {
  const [rangeDays, setRangeDays] = useState<number>(180);

  // QUERY FOR ADMIN REPORTS
  const reportsQuery = useQuery({
    queryKey: ["admin-reports", rangeDays],
    queryFn: () => adminService.getReports({ days: rangeDays }),
    staleTime: 60_000,
  });

  // MEMOIZED REPORTS
  const report = reportsQuery.data?.data;

  // MEMOIZED TOTAL ALERT ITEMS
  const totalAlertItems = useMemo(
    () => report?.alerts.reduce((sum, alert) => sum + alert.value, 0) ?? 0,
    [report?.alerts],
  );

  const topCourtType = report?.courtTypePerformance[0] ?? null;

  if (reportsQuery.isPending) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
              Reports Intelligence
            </h1>
            <p className="text-sm text-muted-foreground">
              Decision-grade analytics across revenue, operations, and organizer
              performance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {rangeOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={rangeDays === option.value ? "secondary" : "outline"}
                className="rounded-none"
                onClick={() => setRangeDays(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Lifetime Revenue"
          value={money(report?.summary.lifetimeRevenue ?? 0)}
          icon={CircleDollarSign}
          subtitle="Paid + completed bookings"
          accent
        />
        <DashboardStatCard
          label="Completed Transactions"
          value={String(report?.summary.completedTransactions ?? 0)}
          icon={BadgeCheck}
          subtitle={`Total bookings: ${report?.summary.totalBookings ?? 0}`}
        />
        <DashboardStatCard
          label="Active Organizers"
          value={String(report?.summary.activeOrganizersInRange ?? 0)}
          icon={BarChart3}
          subtitle={`Window: ${report?.rangeDays ?? rangeDays} days`}
        />
        <DashboardStatCard
          label="Operational Alerts"
          value={String(totalAlertItems)}
          icon={AlertTriangle}
          subtitle="Pending approvals + expiring coupons"
        />
      </div>

      <AdminReportsCharts
        monthlyRevenue={report?.monthlyRevenue ?? []}
        statusBreakdown={report?.statusBreakdown ?? []}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-none border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
              Top Organizers by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-155">
                <TableHeader>
                  <TableRow>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Courts</TableHead>
                    <TableHead>Paid Bookings</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(report?.topOrganizers.length ?? 0) === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No organizer revenue activity found for this range.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (report?.topOrganizers ?? []).map((organizer) => (
                      <TableRow key={organizer.organizerId}>
                        <TableCell className="font-semibold text-primary">
                          {organizer.businessName}
                        </TableCell>
                        <TableCell>{organizer.ownerName}</TableCell>
                        <TableCell>{organizer.courtCount}</TableCell>
                        <TableCell>{organizer.paidBookings}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {money(organizer.revenue)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-none border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
                Court Type Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(report?.courtTypePerformance ?? []).map((row) => {
                const maxRevenue =
                  report?.courtTypePerformance[0]?.revenue ?? 1;
                const width = Math.max(
                  6,
                  Math.min(100, (row.revenue / maxRevenue) * 100),
                );

                return (
                  <div key={row.courtType} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <p className="font-semibold text-foreground">
                        {row.courtType}
                      </p>
                      <p className="text-muted-foreground">
                        {money(row.revenue)}
                      </p>
                    </div>
                    <div className="h-2 w-full bg-muted">
                      <div
                        className="h-2 bg-secondary"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {row.paidBookings} paid bookings
                    </p>
                  </div>
                );
              })}

              {!report?.courtTypePerformance?.length ? (
                <p className="text-xs text-muted-foreground">
                  No court type revenue data available.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-none border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
                Operational Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(report?.alerts ?? []).map((alert) => (
                <div
                  key={alert.key}
                  className="flex items-center justify-between border border-border px-2.5 py-2"
                >
                  <p className="text-xs text-foreground">{alert.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary">
                      {alert.value}
                    </span>
                    <Badge variant={severityToVariant(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-none border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
                Spotlight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="text-muted-foreground">
                Top court type in selected range:
              </p>
              <p className="font-heading text-xl font-black uppercase tracking-tight text-primary">
                {topCourtType?.courtType ?? "No Data"}
              </p>
              {topCourtType ? (
                <p className="text-muted-foreground">
                  {money(topCourtType.revenue)} from {topCourtType.paidBookings}{" "}
                  paid bookings.
                </p>
              ) : null}
              <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Layers className="size-3.5" />
                Generated{" "}
                {report ? new Date(report.generatedAt).toLocaleString() : "-"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {reportsQuery.isError ? (
        <p className="text-xs text-destructive">Failed to load reports data.</p>
      ) : null}
    </div>
  );
}
