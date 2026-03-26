"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type StatusKey = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";

type AdminReportsChartsProps = {
  monthlyRevenue: Array<{
    monthKey: string;
    monthLabel: string;
    revenue: number;
  }>;
  statusBreakdown: Array<{ status: StatusKey; count: number }>;
};

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#012d1d",
  },
} satisfies ChartConfig;

const bookingStatusChartConfig = {
  PENDING: {
    label: "Pending",
    color: "#fbbf24",
  },
  PAID: {
    label: "Paid",
    color: "#84cc16",
  },
  COMPLETED: {
    label: "Completed",
    color: "#0ea5e9",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export function AdminReportsCharts({
  monthlyRevenue,
  statusBreakdown,
}: AdminReportsChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
      <Card className="rounded-none border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className="h-70 w-full">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {monthlyRevenue.map((row) => (
                  <Cell key={row.monthKey} fill="var(--color-revenue)" />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-none border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Booking Status Mix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer
            config={bookingStatusChartConfig}
            className="mx-auto h-56 w-full max-w-72"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={statusBreakdown}
                dataKey="count"
                nameKey="status"
                innerRadius={55}
                outerRadius={86}
                strokeWidth={4}
              >
                {statusBreakdown.map((row) => (
                  <Cell key={row.status} fill={`var(--color-${row.status})`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="space-y-2">
            {statusBreakdown.map((row) => (
              <div
                key={row.status}
                className="flex items-center justify-between text-xs"
              >
                <p className="font-medium text-foreground">{row.status}</p>
                <p className="text-muted-foreground">{row.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
