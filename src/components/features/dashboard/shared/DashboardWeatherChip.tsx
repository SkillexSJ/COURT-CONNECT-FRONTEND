"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSun,
  Cloudy,
  Snowflake,
  Sun,
} from "lucide-react";

import { weatherService } from "@/service/weather.service";

/**
 * THIS IS A WIDGET COMPONENT FOR SHOWING WEATHER INFORMATION IN DASHBOARD
 */

type WeatherVisual = {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const WEATHER_REFRESH_MS = 10 * 60 * 1000;

// HELPERS
const getWeatherVisual = (code: number, isDay: boolean): WeatherVisual => {
  if (code === 0) {
    return { label: "Clear", Icon: isDay ? Sun : CloudSun };
  }

  if ([1, 2].includes(code)) {
    return { label: "Partly Cloudy", Icon: CloudSun };
  }

  if (code === 3) {
    return { label: "Cloudy", Icon: Cloudy };
  }

  if ([45, 48].includes(code)) {
    return { label: "Fog", Icon: CloudFog };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return { label: "Drizzle", Icon: CloudDrizzle };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { label: "Rain", Icon: CloudRain };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { label: "Snow", Icon: Snowflake };
  }

  if ([95, 96, 99].includes(code)) {
    return { label: "Storm", Icon: CloudRain };
  }

  return { label: "Weather", Icon: Cloud };
};

export function DashboardWeatherChip() {
  // QUERIES
  const weatherQuery = useQuery({
    queryKey: ["dashboard-weather-current"],
    queryFn: () => weatherService.getCurrentWeather(),
    staleTime: WEATHER_REFRESH_MS,
    gcTime: 30 * 60 * 1000,
    refetchInterval: WEATHER_REFRESH_MS,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });

  if (weatherQuery.isLoading) {
    return (
      <div className="h-10 w-40 animate-pulse rounded-md border border-primary/20 bg-primary/10 md:h-10 md:w-36 md:border-transparent md:bg-transparent" />
    );
  }

  if (weatherQuery.isError || !weatherQuery.data) {
    return null;
  }

  const weather = weatherQuery.data;
  const visual = getWeatherVisual(weather.weatherCode, weather.isDay);
  const shortLocation = weather.cityLabel.split(",")[0]?.trim() || "Local";

  return (
    <div className="inline-flex h-10 w-40 min-w-0 items-center justify-start gap-2 rounded-md border border-primary/35 bg-primary px-3 py-2 text-primary-foreground shadow-sm md:h-auto md:w-auto md:max-w-68 md:justify-start md:gap-2 md:border-transparent md:bg-transparent md:px-0 md:py-0 md:text-inherit md:shadow-none">
      <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/25 ring-1 ring-secondary/40 md:h-auto md:w-auto md:rounded-none md:bg-transparent md:ring-0">
        <visual.Icon className="h-3.5 w-3.5 text-secondary md:h-4 md:w-4 md:text-primary" />
      </div>
      <p className="truncate text-[11px] font-black uppercase tracking-[0.12em] text-primary-foreground md:hidden">
        {weather.temperatureC} C • {shortLocation}
      </p>
      <div className="hidden min-w-0 md:block">
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          {weather.temperatureC} C • {visual.label}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">
          {weather.cityLabel} • Wind {weather.windSpeedKmh} km/h
        </p>
      </div>
    </div>
  );
}
