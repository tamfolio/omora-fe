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

  const isKycRoute = pathname?.includes('/kyc-verification');

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    
    setIsChecking(false);

    if (status === "unauthenticated") {
      const returnUrl = encodeURIComponent(pathname || "/dashboard");
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }
  }, [status, router, pathname]);

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

  if (status === "authenticated") {
    return (
      <>
        {!isKycRoute && <Navbar />}
        {children}
        {!isKycRoute && <Footer />}
      </>
    );
  }

  return null;
}