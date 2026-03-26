import type { GeoSource } from "@/types/shared.types";
import type { CurrentWeatherData, WeatherCoords } from "@/types/weather.types";

const FALLBACK_COORDS: WeatherCoords = {
  latitude: 23.8103,
  longitude: 90.4125,
};

const FALLBACK_CITY = "Dhaka";

const GEO_TIMEOUT_MS = 4_000;
const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000;
const CITY_CACHE_TTL_MS = 30 * 60 * 1000;

let weatherCache:
  | {
      data: CurrentWeatherData;
      expiresAt: number;
    }
  | undefined;
let weatherInFlight: Promise<CurrentWeatherData> | undefined;

const cityCache = new Map<string, { label: string; expiresAt: number }>();

const roundToInt = (value: number) => Math.round(value);
const getCityCacheKey = (coords: WeatherCoords) =>
  `${coords.latitude.toFixed(2)},${coords.longitude.toFixed(2)}`;

/***
 * HELPER FUNCTION TO GET THE COORDINATES
 */
const getBrowserCoords = async (): Promise<{
  coords: WeatherCoords;
  source: GeoSource;
}> => {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return { coords: FALLBACK_COORDS, source: "fallback" };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          source: "geolocation",
        });
      },
      () => {
        resolve({ coords: FALLBACK_COORDS, source: "fallback" });
      },
      {
        enableHighAccuracy: false,
        timeout: GEO_TIMEOUT_MS,
        maximumAge: 15 * 60 * 1000,
      },
    );
  });
};

/**
 * HELPER FUNCTION TO GET THE CITY LABEL FROM COORDINATES USING OPEN-METEO GEOCODING API
 */
const getCityLabel = async (coords: WeatherCoords) => {
  const cityCacheKey = getCityCacheKey(coords);
  const cachedCity = cityCache.get(cityCacheKey);
  const now = Date.now();

  if (cachedCity && cachedCity.expiresAt > now) {
    return cachedCity.label;
  }

  try {
    const reverseUrl = new URL(
      "https://geocoding-api.open-meteo.com/v1/reverse",
    );
    reverseUrl.searchParams.set("latitude", String(coords.latitude));
    reverseUrl.searchParams.set("longitude", String(coords.longitude));
    reverseUrl.searchParams.set("count", "1");
    reverseUrl.searchParams.set("language", "en");
    reverseUrl.searchParams.set("format", "json");

    const response = await fetch(reverseUrl.toString());

    if (!response.ok) {
      return FALLBACK_CITY;
    }

    const data = (await response.json()) as {
      results?: Array<{ name?: string; country?: string }>;
    };

    const first = data.results?.[0];
    if (!first?.name) {
      return FALLBACK_CITY;
    }

    const label = first.country
      ? `${first.name}, ${first.country}`
      : first.name;
    cityCache.set(cityCacheKey, {
      label,
      expiresAt: now + CITY_CACHE_TTL_MS,
    });

    return label;
  } catch {
    return FALLBACK_CITY;
  }
};

export const weatherService = {
  async getCurrentWeather(): Promise<CurrentWeatherData> {
    const now = Date.now();

    if (weatherCache && weatherCache.expiresAt > now) {
      return weatherCache.data;
    }

    if (weatherInFlight) {
      return weatherInFlight;
    }

    weatherInFlight = (async () => {
      const { coords, source } = await getBrowserCoords();

      const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
      weatherUrl.searchParams.set("latitude", String(coords.latitude));
      weatherUrl.searchParams.set("longitude", String(coords.longitude));
      weatherUrl.searchParams.set(
        "current",
        "temperature_2m,weather_code,is_day,wind_speed_10m",
      );
      weatherUrl.searchParams.set("timezone", "auto");

      const [weatherResponse, cityLabel] = await Promise.all([
        fetch(weatherUrl.toString()),
        getCityLabel(coords),
      ]);

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const payload = (await weatherResponse.json()) as {
        current?: {
          temperature_2m?: number;
          weather_code?: number;
          is_day?: number;
          wind_speed_10m?: number;
        };
      };

      const current = payload.current;

      if (!current) {
        throw new Error("Weather data unavailable");
      }

      const result: CurrentWeatherData = {
        temperatureC: roundToInt(current.temperature_2m ?? 0),
        weatherCode: current.weather_code ?? 0,
        isDay: current.is_day === 1,
        windSpeedKmh: roundToInt(current.wind_speed_10m ?? 0),
        cityLabel,
        source,
      };

      weatherCache = {
        data: result,
        expiresAt: Date.now() + WEATHER_CACHE_TTL_MS,
      };

      return result;
    })();

    try {
      return await weatherInFlight;
    } finally {
      weatherInFlight = undefined;
    }
  },
};
