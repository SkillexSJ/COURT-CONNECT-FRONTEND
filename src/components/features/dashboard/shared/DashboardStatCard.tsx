import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";


/**
 * REUSABLE COMPONENT FOR DISPLAYING STATS IN DASHBOARD
 */

type DashboardStatCardProps = {
  label: string;
  value: string;
  icon?: LucideIcon;
  accent?: boolean;
  subtitle?: string;
  className?: string;
};

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  accent,
  subtitle,
  className,
}: DashboardStatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-none border-none",
        accent
          ? "bg-secondary text-secondary-foreground"
          : "bg-primary text-primary-foreground",
        className,
      )}
    >
      <CardContent className="flex h-full min-h-44 flex-col p-4 sm:min-h-52 sm:p-6">
        {Icon && (
          <span
            aria-hidden="true"
            className={cn(
              "mb-5 inline-flex h-10 w-10 items-center justify-center rounded-sm border sm:mb-6 sm:h-12 sm:w-12",
              accent
                ? "border-secondary-foreground/30 bg-secondary-foreground/10"
                : "border-primary-foreground/25 bg-primary-foreground/10",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 sm:h-6 sm:w-6",
                accent
                  ? "text-secondary-foreground/95"
                  : "text-primary-foreground/95",
              )}
              strokeWidth={2.1}
            />
          </span>
        )}

        <p
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.2em]",
            accent
              ? "text-secondary-foreground/70"
              : "text-primary-foreground/75",
          )}
        >
          {label}
        </p>

        <p
          className={cn(
            "mt-2 font-heading text-4xl leading-none font-black tracking-tight sm:text-5xl",
            accent ? "text-secondary-foreground" : "text-primary-foreground",
          )}
        >
          {value}
        </p>

        {subtitle && (
          <p
            className={cn(
              "mt-2 text-sm font-semibold",
              accent
                ? "text-secondary-foreground/80"
                : "text-primary-foreground/80",
            )}
          >
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
