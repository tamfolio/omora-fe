"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RiCustomerServiceLine } from "react-icons/ri";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";
import IndividualSignup from "@/components/auth/IndivisualSignup";
import CorporateSignup from "@/components/auth/CorporateSignup";

export default function Signup() {
  const [accountType, setAccountType] = useState("individual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignupSuccess = () => {
    router.push("/auth/login?message=Account created successfully");
  };

  const handleSignupError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-hide">
        {/* Customer Service Icon */}
        <div className="fixed bottom-6 right-6 z-10">
          <button className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200">
            <RiCustomerServiceLine className="h-6 w-6" />
          </button>
        </div>

        {/* Content Container */}
        <div className="min-h-full flex flex-col">
          {/* Top Logo */}
          <div className="p-8">
            <Logo width={150} height={40} />
          </div>

          {/* Centered Signup Form */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
              {/* Center Logo */}
              <div className="text-center">
                <div className="mx-auto mb-2 w-12 h-12 flex items-center justify-center">
                  <Icon width={32} height={32} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Create an account
                </h2>
              </div>

              {/* Account Type Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("individual");
                    setError(""); // Clear errors when switching tabs
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
                    accountType === "individual"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("corporate");
                    setError(""); // Clear errors when switching tabs
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
                    accountType === "corporate"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Corporate
                </button>
              </div>

              {/* Global Error Display */}
              {error && (
                <div className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-md">
                  {error}
                </div>
              )}

              {/* Conditional Form Rendering */}
              {accountType === "individual" ? (
                <IndividualSignup
                  onSuccess={handleSignupSuccess}
                  onError={handleSignupError}
                  loading={loading}
                  setLoading={setLoading}
                />
              ) : (
                <CorporateSignup
                  onSuccess={handleSignupSuccess}
                  onError={handleSignupError}
                  loading={loading}
                  setLoading={setLoading}
                />
              )}

              {/* OR divider */}
              <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Login link */}
              <div className="text-center text-xs">
                <span className="text-gray-600">Already have an account? </span>
                <Link
                  href="/auth/login"
                  className="text-teal-600 hover:text-teal-500 font-medium"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
