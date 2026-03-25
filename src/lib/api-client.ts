import { env } from "@/config/env";

/**
 * ROBUST API CLIENT WITH BUILT-IN ERROR HANDLING AND RETRY LOGIC
 */

// header type define
export type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const getErrorMessageFromData = (data: unknown): string | undefined => {
  if (typeof data === "object" && data !== null) {
    const payload = data as {
      message?: unknown;
      code?: unknown;
      details?: unknown;
    };

    const maybeMessage = payload.message;
    if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
      // Prefer first field-level validation message
      if (
        maybeMessage === "Validation failed" &&
        Array.isArray(payload.details)
      ) {
        const firstDetail = payload.details[0] as
          | { message?: unknown }
          | undefined;
        if (
          firstDetail &&
          typeof firstDetail.message === "string" &&
          firstDetail.message.trim().length > 0
        ) {
          return firstDetail.message;
        }
      }
      return maybeMessage;
    }

    const maybeCode = payload.code;
    if (typeof maybeCode === "string" && maybeCode.trim().length > 0) {
      return maybeCode
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  }

  return undefined;
};

// remove double slashes
const cleanPath = (path: string) => path.replace(/^\/+/, "");

async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {},
  retries = 2,
): Promise<T> {
  const { headers = {}, ...rest } = options;

  // FormData and JSON
  const contentTypeHeader: Record<string, string> =
    rest.body instanceof FormData ? {} : { "Content-Type": "application/json" };

  const defaultHeaders: Record<string, string> = {
    ...contentTypeHeader,
    ...headers,
  };

  const config: RequestInit = {
    ...rest,
    cache: rest.cache ?? "no-store", // default
    headers: defaultHeaders,
    credentials: "include",
  };

  //  URL Slash logic
  const baseUrl = env.API_URL.replace(/\/+$/, "");
  const url = `${baseUrl}/${cleanPath(endpoint)}`;

  try {
    const response = await fetch(url, config);

    // JSON PARSING
    let data: unknown = null;
    const contentType = response.headers.get("content-type");

    // parse JSON strict
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        console.error("Failed to parse JSON response");
        data = null;
      }
    }

    if (!response.ok) {
      // retry for  5xx error
      if (retries > 0 && (response.status >= 500 || response.status === 404)) {
        // wait korbo
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetcher(endpoint, options, retries - 1);
      }

      //non-JSON errors
      const errorMessage =
        getErrorMessageFromData(data) ||
        response.statusText ||
        `Error ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (retries > 0 && !(error instanceof ApiError)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetcher(endpoint, options, retries - 1);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("API Request Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred",
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: "DELETE" }),
};
