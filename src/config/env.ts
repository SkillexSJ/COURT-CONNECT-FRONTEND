export const env = {
  // Server-side needs full URL, Client-side uses relative (proxy)
  API_URL:
    typeof window === "undefined"
      ? (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/api"
      : "/api",
  APP_URL:
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : window.location.origin,
};
