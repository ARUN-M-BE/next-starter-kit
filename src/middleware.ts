import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  const path = request.nextUrl.pathname;

  // List of protected routes
  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/maps") ||
    path.startsWith("/contact");

  // Authentication page routes
  const isAuthRoute =
    path.startsWith("/auth/login") || path.startsWith("/auth/verify-otp");

  // Profile setup route
  const isProfileSetupRoute = path.startsWith("/auth/profile-setup");

  // If page is protected and user is not logged in, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    // Keep reference of where they wanted to go
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in, restrict auth routes and redirect to dashboard/profile-setup
  if (token) {
    try {
      // Validate session via API check
      const checkRes = await fetch(new URL("/api/auth/profile", request.url).toString(), {
        headers: {
          Cookie: `session_token=${token}`,
        },
      });

      if (checkRes.ok) {
        const { user } = await checkRes.json();

        // If login pages are requested, redirect to dashboard or profile setup
        if (isAuthRoute) {
          if (!user.isProfileComplete) {
            return NextResponse.redirect(new URL("/auth/profile-setup", request.url));
          }
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // If profile setup is requested but already complete, redirect to dashboard
        if (isProfileSetupRoute && user.isProfileComplete) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // If profile setup is NOT complete, force them to complete it
        if (isProtectedRoute && !user.isProfileComplete) {
          return NextResponse.redirect(new URL("/auth/profile-setup", request.url));
        }
      } else {
        // Token is invalid/expired in db, clean it up
        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("session_token");
        return response;
      }
    } catch (err) {
      console.error("Middleware Auth Verification Error:", err);
      // In case of API errors, let it pass to avoid blocking user, or fallback
    }
  }

  return NextResponse.next();
}

// Config to specify matching routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/maps/:path*",
    "/contact/:path*",
    "/auth/:path*",
  ],
};
