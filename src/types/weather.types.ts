import type { GeoSource } from "@/types/shared.types";

export type WeatherCoords = {
  latitude: number;
  longitude: number;
};

export type CurrentWeatherData = {
  temperatureC: number;
  windSpeedKmh: number;
  weatherCode: number;
  isDay: boolean;
  cityLabel: string;
  source: GeoSource;
};
