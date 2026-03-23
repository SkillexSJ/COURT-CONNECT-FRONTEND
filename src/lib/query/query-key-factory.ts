type Primitive = string | number | boolean | null | undefined;

export type QueryKeyParams =
  | Primitive
  | Primitive[]
  | Record<string, Primitive | Primitive[]>;

const normalizeArray = (values: Primitive[]) => [...values].sort();

const normalizeParams = (params?: QueryKeyParams) => {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return params;
  }

  const sortedEntries = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));

  const normalized = Object.fromEntries(
    sortedEntries.map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, normalizeArray(value)];
      }
      return [key, value];
    }),
  );

  return normalized;
};

export const createEntityQueryKeys = <
  TListParams extends QueryKeyParams = QueryKeyParams,
>(
  entity: string,
) => {
  const all = [entity] as const;

  return {
    all,
    lists: () => [...all, "list"] as const,
    list: (params?: TListParams) =>
      [...all, "list", normalizeParams(params)] as const,
    details: () => [...all, "detail"] as const,
    detail: (id: string) => [...all, "detail", id] as const,
  };
};
