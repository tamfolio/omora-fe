import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log("🔥 MIDDLEWARE RUNNING:", pathname);
  
  // Block all dashboard access - testing only
  if (pathname.startsWith("/dashboard")) {
    console.log("❌ BLOCKING /dashboard - redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  console.log("✅ ALLOWING:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",           // ✅ Matches /dashboard
    "/dashboard/:path*",    // ✅ Matches /dashboard/anything
  ],
};