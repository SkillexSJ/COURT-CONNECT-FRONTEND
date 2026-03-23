import type { QueryClient } from "@tanstack/react-query";

export const invalidateEntityList = async (
  queryClient: QueryClient,
  key: readonly unknown[],
) => {
  await queryClient.invalidateQueries({ queryKey: key });
};

export const invalidateEntityDetail = async (
  queryClient: QueryClient,
  key: readonly unknown[],
) => {
  await queryClient.invalidateQueries({ queryKey: key, exact: true });
};

export const removeEntityCache = async (
  queryClient: QueryClient,
  key: readonly unknown[],
) => {
  await queryClient.removeQueries({ queryKey: key });
};
