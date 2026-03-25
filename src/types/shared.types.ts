export type UserRole = "USER" | "ORGANIZER" | "ADMIN";

export type QueryParamValue = string | number | boolean | null | undefined;

export type QueryParamsRecord = Record<string, QueryParamValue>;

export type GeoSource = "geolocation" | "fallback";
