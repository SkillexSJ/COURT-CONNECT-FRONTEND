import { QueryClient } from "@tanstack/react-query";
import { MUTATION_DEFAULTS, QUERY_DEFAULTS } from "@/lib/query/query-defaults";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_DEFAULTS.staleTime,
        gcTime: QUERY_DEFAULTS.gcTime,
        retry: QUERY_DEFAULTS.retry,
        refetchOnWindowFocus: QUERY_DEFAULTS.refetchOnWindowFocus,
      },
      mutations: {
        retry: MUTATION_DEFAULTS.retry,
      },
    },
  });
