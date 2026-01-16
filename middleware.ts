// middleware.ts
// Place this file at: src/middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Allow access to auth pages
    if (pathname.startsWith("/auth")) {
      // Redirect to dashboard if already logged in
      if (token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Protect ALL dashboard routes
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("returnUrl", pathname);
        return NextResponse.redirect(url);
      }

      // Optional: Add KYC/Risk Profile checks here
      // if (!token.user?.kycCompleted && pathname !== "/dashboard/kyc-verification") {
      //   return NextResponse.redirect(new URL("/dashboard/kyc-verification", req.url));
      // }

      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes - always allow
        const publicRoutes = [
          "/",
          "/about-us",
          "/insights",
          "/newsroom",
          "/frequently-asked-questions",
          "/cookie-policy",
          "/privacy-policy",
          "/terms-of-use",
          "/crypto-asset-market-data",
        ];

        // Check if current path is public
        if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
          return true;
        }

        // Auth pages - always allow
        if (pathname.startsWith("/auth")) {
          return true;
        }

        // Dashboard routes - require authentication
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        // Default: allow
        return true;
      },
    },
  }
);

// Specify which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder (assets, images)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|assets|api).*)",
  ],
};