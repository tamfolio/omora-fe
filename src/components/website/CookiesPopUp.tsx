"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CookiesPopUp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has already made a choice
  useEffect(() => {
    const cookieConsent = localStorage.getItem("omora-cookie-consent");

    if (!cookieConsent) {
      // Show popup after a short delay for better UX
      setTimeout(() => {
        setIsVisible(true);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleAcceptAll = () => {
    // Save acceptance with timestamp
    localStorage.setItem(
      "omora-cookie-consent",
      JSON.stringify({
        accepted: true,
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      }),
    );

    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    // Save rejection (only essential cookies)
    localStorage.setItem(
      "omora-cookie-consent",
      JSON.stringify({
        accepted: true,
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      }),
    );

    setIsVisible(false);
  };

  // Don't render anything while checking localStorage
  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={() => {}} // Prevent closing by clicking backdrop
      />

      {/* Cookie popup */}
      <div className="fixed z-50 bottom-8 right-8 rounded-2xl bg-[#00717D] p-6 text-[#ECFEFF] w-full max-w-[488px] shadow-2xl animate-in slide-in-from-bottom duration-300">
        <h1 className="text-xl font-semibold mb-3">🍪 Omora Uses Cookies</h1>

        <p className="text-base leading-relaxed mb-4">
          We use cookies to enhance your experience, analyze site traffic, and
          serve targeted content. By continuing to use Omora, you consent to our
          use of cookies.
        </p>

        <div className="space-y-2 text-sm">
          <Link
            href="/cookie-policy"
            className="underline hover:text-white transition-colors inline-block"
          >
            Learn more about cookies
          </Link>
          <br />
          <Link
            href="/privacy-policy"
            className="underline hover:text-white transition-colors inline-block"
          >
            View our Privacy Policy
          </Link>
        </div>

        <div className="border-t border-dashed my-6 border-[#ECFEFF] opacity-50"></div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            onClick={handleRejectNonEssential}
            className="flex-1 sm:w-auto px-4 py-3 rounded-lg text-base font-medium hover:bg-[#008B99] bg-[#008B99] transition-colors"
          >
            Reject non-essential
          </Button>

          <Button
            onClick={handleAcceptAll}
            className="flex-1 sm:w-auto px-4 py-3 rounded-lg text-base font-medium hover:bg-white bg-white text-[#00717D] hover:text-[#155E75] transition-colors"
          >
            Accept all
          </Button>
        </div>

        {/* Small print */}
        <p className="text-xs mt-4 text-[#ECFEFF] opacity-75">
          You can change your cookie preferences anytime in Settings.
        </p>
      </div>
    </>
  );
}
