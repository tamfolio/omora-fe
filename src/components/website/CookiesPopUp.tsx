"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CookiesPopUp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("omora-cookie-consent");

    if (!cookieConsent) {
      setTimeout(() => {
        setIsVisible(true);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleAcceptAll = () => {
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

  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity backdrop-blur-[2px]"
      />

      {/* Cookie popup */}
      <div className="fixed z-50 bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto rounded-2xl bg-[#00717D] p-5 md:p-6 text-[#ECFEFF] md:w-full md:max-w-[488px] shadow-2xl animate-in slide-in-from-bottom duration-500 ease-out">
        <div className="flex items-center gap-2 mb-2 md:mb-3">
            <span className="text-xl">🍪</span>
            <h1 className="text-lg md:text-xl font-semibold">Omora Uses Cookies</h1>
        </div>

        <p className="text-sm md:text-base leading-relaxed mb-4 opacity-90">
          We use cookies to enhance your experience, analyze site traffic, and
          serve targeted content. By continuing to use Omora, you consent to our
          use of cookies.
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm mb-6">
          <Link
            href="/cookie-policy"
            className="underline hover:text-white transition-colors"
          >
            Learn more about cookies
          </Link>
          <Link
            href="/privacy-policy"
            className="underline hover:text-white transition-colors"
          >
            View our Privacy Policy
          </Link>
        </div>

        <div className="border-t border-dashed mb-6 border-[#ECFEFF]/30"></div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            onClick={handleRejectNonEssential}
            className="flex-1 px-4 py-3 rounded-lg text-sm md:text-base font-medium border border-white/20 hover:bg-white/10 bg-transparent text-white transition-colors"
          >
            Reject non-essential
          </Button>

          <Button
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-3 rounded-lg text-sm md:text-base font-medium hover:bg-[#f0f9fa] bg-white text-[#00717D] transition-colors shadow-sm"
          >
            Accept all
          </Button>
        </div>

        <p className="text-[10px] md:text-xs mt-4 text-[#ECFEFF]/70 text-center sm:text-left italic">
          You can change your cookie preferences anytime in Settings.
        </p>
      </div>
    </>
  );
}