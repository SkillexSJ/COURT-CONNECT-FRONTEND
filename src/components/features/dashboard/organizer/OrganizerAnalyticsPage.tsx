"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { organizerService } from "@/service/organizer.service";
import { CircleDollarSign, Building2, Timer } from "lucide-react";

/**
 * 
 * THIS IS A COMPLEX FOR ORGANIZER ANALYTICS . HEATMAP ACHE 
 * 
 */


const formatMoney = (value: number) => `USD ${value.toFixed(2)}`;
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function OrganizerAnalyticsPage() {
  // QUERY FOR GETTING REVENUE BREAKDOWN
  const revenueBreakdownQuery = useQuery({
    queryKey: ["organizer-revenue-breakdown", 90],
    queryFn: () => organizerService.getRevenueBreakdown({ days: 90 }),
    staleTime: 60_000,
  });

  const revenueBreakdown = revenueBreakdownQuery.data?.data;

  // MEMOIZED VALUES
  const topVenue = revenueBreakdown?.venueBreakdown?.[0] ?? null;

  const underperformingWindow = useMemo(() => {
    const rows = (revenueBreakdown?.slotWindowBreakdown ?? []).filter(
      (window) => window.slotCount > 0,
    );

    if (rows.length === 0) return null;
    return [...rows].sort((a, b) => a.revenue - b.revenue)[0];
  }, [revenueBreakdown?.slotWindowBreakdown]);

  const dayBreakdown = useMemo(() => {
    const rows = revenueBreakdown?.dayOfWeekBreakdown ?? [];
    return [...rows].sort(
      (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
    );
  }, [revenueBreakdown?.dayOfWeekBreakdown]);

  /**
   * SETTINGS FOR HEATMAP
   */
  const heatmapRows = revenueBreakdown?.heatmap ?? [];
  const slotWindows = revenueBreakdown?.slotWindowBreakdown ?? [];
  const maxHeatRevenue = Math.max(
    1,
    ...heatmapRows.map((cell) => Number(cell.revenue ?? 0)),
  );

  // HELPERS
  const getHeatCell = (dayOfWeek: number, windowKey: string) => {
    return (
      heatmapRows.find(
        (cell) => cell.dayOfWeek === dayOfWeek && cell.windowKey === windowKey,
      ) ?? null
    );
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Revenue breakdown by venue, day-of-week, and slot windows.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Total Revenue"
          value={formatMoney(revenueBreakdown?.summary.totalRevenue ?? 0)}
          icon={CircleDollarSign}
          subtitle={`Last ${revenueBreakdown?.rangeDays ?? 90} days`}
          accent
        />
        <DashboardStatCard
          label="Top Revenue Venue"
          value={topVenue?.courtName ?? "No data"}
          icon={Building2}
          subtitle={
            topVenue
              ? `${formatMoney(topVenue.revenue)} • ${topVenue.bookings} bookings`
              : "No paid booking revenue found"
          }
        />
        <DashboardStatCard
          label="Underperforming Window"
          value={underperformingWindow?.label ?? "No data"}
          icon={Timer}
          subtitle={
            underperformingWindow
              ? `${formatMoney(underperformingWindow.revenue)} • ${underperformingWindow.slotCount} slots`
              : "No slot data available"
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-none border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
              Revenue Heatmap (Day x Slot)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto">
              <div className="min-w-160 space-y-2">
                <div className="grid grid-cols-[120px_repeat(5,minmax(0,1fr))] gap-2">
                  <div />
                  {slotWindows.map((window) => (
                    <p
                      key={window.windowKey}
                      className="text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {window.label}
                    </p>
                  ))}
                </div>

                {dayBreakdown.map((day) => (
                  <div
                    key={day.dayOfWeek}
                    className="grid grid-cols-[120px_repeat(5,minmax(0,1fr))] items-center gap-2"
                  >
                    <p className="text-xs font-semibold text-foreground">
                      {day.label}
                    </p>

                    {slotWindows.map((window) => {
                      const cell = getHeatCell(day.dayOfWeek, window.windowKey);
                      const ratio = Number(cell?.revenue ?? 0) / maxHeatRevenue;
                      const opacity = Math.max(0.08, Math.min(1, ratio));

                      return (
                        <div
                          key={`${day.dayOfWeek}-${window.windowKey}`}
                          className="rounded-none border border-border px-2 py-2 text-center"
                          style={{
                            backgroundColor: `rgba(196, 244, 9, ${opacity})`,
                          }}
                          title={`${day.label} ${window.label}: ${formatMoney(Number(cell?.revenue ?? 0))}`}
                        >
                          <p className="font-heading text-xs font-black text-primary">
                            {formatMoney(Number(cell?.revenue ?? 0))}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-none border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
                Revenue by Venue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(revenueBreakdown?.venueBreakdown ?? [])
                .slice(0, 8)
                .map((venue) => (
                  <div key={venue.courtId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <p className="font-semibold text-foreground">
                        {venue.courtName}
                      </p>
                      <p className="text-muted-foreground">
                        {formatMoney(venue.revenue)}
                      </p>
                    </div>
                    <div className="h-2 w-full bg-muted">
                      <div
                        className="h-2 bg-secondary"
                        style={{
                          width: `${Math.min(100, venue.sharePercent)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

              {(revenueBreakdown?.venueBreakdown?.length ?? 0) === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No paid booking revenue found in this period.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-none border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
                Revenue by Day of Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dayBreakdown.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className="flex items-center justify-between text-xs"
                >
                  <p className="font-medium text-foreground">{day.label}</p>
                  <p className="text-muted-foreground">
                    {formatMoney(day.revenue)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
