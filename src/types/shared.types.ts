export type UserRole = "USER" | "ORGANIZER" | "ADMIN";

export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly (string | number)[];

export type QueryParamsRecord = Record<string, QueryParamValue>;

export type PaginationQuery = {
  page?: number;
  limit?: number;
};

export type SearchQuery = {
  searchTerm?: string;
};

export type SortQuery = {
  sortBy?: string;
};

export type ListQuery = PaginationQuery & SearchQuery & SortQuery;

export type DaysRangeQuery = {
  days?: number;
};

export type GeoSource = "geolocation" | "fallback";
