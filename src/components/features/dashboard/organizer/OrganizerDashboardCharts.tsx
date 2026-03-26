"use client";

import { Area, AreaChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type OrganizerDashboardChartsProps = {
  trendData: Array<{ month: string; bookings: number }>;
  occupancyPercent: number;
};

const trendChartConfig = {
  bookings: {
    label: "Bookings",
    color: "#012d1d",
  },
} satisfies ChartConfig;

const donutChartConfig = {
  used: {
    label: "Occupancy",
    color: "#c4f409",
  },
  remaining: {
    label: "Remaining",
    color: "#e8e9e0",
  },
} satisfies ChartConfig;

export function OrganizerDashboardCharts({
  trendData,
  occupancyPercent,
}: OrganizerDashboardChartsProps) {
  return (
    <div className="space-y-4">
      <Card className="rounded-none border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Venue Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer
            config={donutChartConfig}
            className="mx-auto h-55 w-full max-w-60"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={[
                  {
                    key: "used",
                    value: occupancyPercent,
                    fill: "var(--color-used)",
                  },
                  {
                    key: "remaining",
                    value: Math.max(0, 100 - occupancyPercent),
                    fill: "var(--color-remaining)",
                  },
                ]}
                dataKey="value"
                nameKey="key"
                innerRadius={58}
                outerRadius={86}
                strokeWidth={4}
              />
            </PieChart>
          </ChartContainer>
          <p className="text-center font-heading text-3xl font-black text-primary">
            {occupancyPercent}%
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-none border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
            Booking Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={trendChartConfig} className="h-50 w-full">
            <AreaChart data={trendData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="bookings"
                type="monotone"
                stroke="var(--color-bookings)"
                fill="var(--color-bookings)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
