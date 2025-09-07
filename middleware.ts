import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    console.log("Auth middleware - token:", req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Define which routes require authentication
        const protectedPaths = ["/dashboard", "/profile", "/admin"];
        const pathname = req.nextUrl.pathname;

        // Allow public routes
        if (!protectedPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        // Check if user has valid token for protected routes
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
