"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieSettings() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });
  const [isSaved, setIsSaved] = useState(false);

  // Load existing preferences
  useEffect(() => {
    const consent = localStorage.getItem("omora-cookie-consent");
    if (consent) {
      const parsed = JSON.parse(consent);
      setPreferences({
        essential: true,
        analytics: parsed.analytics || false,
        marketing: parsed.marketing || false,
      });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(
      "omora-cookie-consent",
      JSON.stringify({
        accepted: true,
        essential: preferences.essential,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        timestamp: new Date().toISOString(),
      }),
    );

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    setPreferences({
      essential: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    setPreferences({
      essential: true, // Can't disable essential
      analytics: false,
      marketing: false,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage your cookie preferences. You can change these settings at any
        time.
      </p>

      {/* Success message */}
      {isSaved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <svg
            className="w-5 h-5 text-green-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-green-800 font-medium">
            Your preferences have been saved!
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Essential Cookies */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Essential Cookies
              </h3>
              <p className="text-sm text-gray-600">
                These cookies are necessary for the platform to function and
                cannot be disabled. They enable core functionality like
                authentication, security, and accessibility.
              </p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-6 bg-[#008B99] rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                Always On
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics Cookies
              </h3>
              <p className="text-sm text-gray-600">
                Help us understand how visitors interact with our platform by
                collecting and reporting information anonymously. Used to
                improve user experience.
              </p>
            </div>
            <button
              onClick={() =>
                setPreferences((prev) => ({
                  ...prev,
                  analytics: !prev.analytics,
                }))
              }
              className="ml-4"
            >
              <div
                className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                  preferences.analytics ? "bg-[#008B99]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences.analytics ? "ml-auto" : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Marketing Cookies */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Marketing Cookies
              </h3>
              <p className="text-sm text-gray-600">
                Used to track visitors across websites and display personalized
                ads and content that are relevant to you. May be set by
                third-party advertising partners.
              </p>
            </div>
            <button
              onClick={() =>
                setPreferences((prev) => ({
                  ...prev,
                  marketing: !prev.marketing,
                }))
              }
              className="ml-4"
            >
              <div
                className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                  preferences.marketing ? "bg-[#008B99]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences.marketing ? "ml-auto" : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleSave}
          className="flex-1 sm:flex-none px-8 py-3 bg-[#008B99] hover:bg-[#007A86] text-white font-semibold rounded-lg"
        >
          Save Preferences
        </Button>

        <Button
          onClick={handleAcceptAll}
          className="flex-1 sm:flex-none px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300"
        >
          Accept All
        </Button>

        <Button
          onClick={handleRejectAll}
          className="flex-1 sm:flex-none px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300"
        >
          Reject All
        </Button>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        For more information about how we use cookies, please read our{" "}
        <a href="/cookie-policy" className="text-[#008B99] hover:underline">
          Cookie Policy
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-[#008B99] hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
