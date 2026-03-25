import type { QueryParamsRecord } from "@/types/shared.types";

/**
 * UTILITY FUNCTION TO BUILD QUERY STRINGS FROM AN OBJECT, HANDLING VARIOUS DATA TYPES AND EDGE CASES
 */

export const buildQueryString = (params?: QueryParamsRecord) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      searchParams.set(key, value.join(","));
      continue;
    }

    searchParams.set(key, String(value));
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};
