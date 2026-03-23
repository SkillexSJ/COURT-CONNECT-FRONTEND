export const QUERY_DEFAULTS = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
} as const;

export const QUERY_STALE_TIME = {
  default: QUERY_DEFAULTS.staleTime,
  static: 5 * 60_000,
  realtime: 15_000,
} as const;

export const QUERY_GC_TIME = {
  default: QUERY_DEFAULTS.gcTime,
  longLived: 30 * 60_000,
} as const;

export const MUTATION_DEFAULTS = {
  retry: 0,
} as const;
