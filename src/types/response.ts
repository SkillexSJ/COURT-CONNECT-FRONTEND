export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// Backward-compatible alias for existing usages.
export type Meta = PaginationMeta;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: unknown;
}

export type ListApiResponse<
  T,
  TMeta extends object = PaginationMeta,
> = ApiResponse<T[]> & {
  meta?: TMeta;
};
