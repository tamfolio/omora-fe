"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/website/NavBar";
import Footer from "@/components/ui/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for session to be checked
    if (status === "loading") {
      return;
    }

    setIsChecking(false);

    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      // Save the attempted URL to redirect back after login
      const returnUrl = encodeURIComponent(pathname || "/dashboard");
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }
  }, [status, router, pathname]);

  // Show loading state while checking authentication
  if (isChecking || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Only render with Navbar and Footer if authenticated
  if (status === "authenticated") {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );
  }

  return null;
}