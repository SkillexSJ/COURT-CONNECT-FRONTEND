import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Route Types
  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/organizer") ||
    path.startsWith("/admin");

  const isAuthRoute = path.startsWith("/signin") || path.startsWith("/signup");

  // Check for Session Cookie
  const sessionToken =
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("session_token")?.value;

  // Protect Private Routes
  if (isProtectedRoute && !sessionToken) {
    // redirect URL
    const response = new URL("/signin", request.url);

    // Save the page
    response.searchParams.set("callbackUrl", path);

    return NextResponse.redirect(response);
  }

  // proceed to next
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/organizer/:path*",
    "/admin/:path*",
    "/signin",
    "/signup",
    "/verify-email",
  ],
};
