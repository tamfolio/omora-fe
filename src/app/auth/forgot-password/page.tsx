"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RiCustomerServiceLine } from "react-icons/ri";
import { 
  HiOutlineKey, 
  HiOutlineMail, 
  HiOutlineCheckCircle,
  HiOutlineLockClosed 
} from "react-icons/hi";
import Logo from "@/components/ui/Logo";

type FlowStep = "email" | "check-email" | "reset-password" | "success";

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if we have a reset token in URL (for step 3)
  const resetToken = searchParams.get("token");
  if (resetToken && currentStep === "email") {
    setCurrentStep("reset-password");
  }

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasSymbol && hasNumber;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to send reset email");
      } else {
        setCurrentStep("check-email");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and contain a special character and number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token: resetToken, 
          password 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to reset password");
      } else {
        setCurrentStep("success");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error("Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case "email":
        return (
          <>
            {/* Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <HiOutlineKey className="h-8 w-8 text-gray-400" />
            </div>

            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Forgot password?
            </h2>
            <p className="text-sm text-gray-600 mb-8 text-center">
              No worries, we'll send you reset instructions.
            </p>

            {/* Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {loading ? "Sending..." : "Reset password"}
              </button>
            </form>
          </>
        );

      case "check-email":
        return (
          <>
            {/* Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <HiOutlineMail className="h-8 w-8 text-gray-400" />
            </div>

            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Check your email
            </h2>
            <p className="text-sm text-gray-600 mb-8 text-center">
              We sent a password reset link to{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>

            {/* Open Email Button */}
            <button
              onClick={() => window.open("mailto:", "_blank")}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mb-6"
            >
              Open email app
            </button>

            {/* Resend */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Didn't receive the email? </span>
              <button
                onClick={handleResendEmail}
                disabled={loading}
                className="text-teal-600 hover:text-teal-500 font-medium"
              >
                {loading ? "Sending..." : "Click to resend"}
              </button>
            </div>
          </>
        );

      case "reset-password":
        return (
          <>
            {/* Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <HiOutlineLockClosed className="h-8 w-8 text-gray-400" />
            </div>

            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Set new password
            </h2>
            <p className="text-sm text-gray-600 mb-8 text-center">
              Your new password must be different to previously used passwords.
            </p>

            {/* Form */}
            <form onSubmit={handlePasswordReset} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="space-y-2">
                <div className={`flex items-center space-x-2 text-sm ${
                  password.length >= 8 ? "text-green-600" : "text-gray-400"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    password.length >= 8 ? "bg-green-500" : "bg-gray-300"
                  }`}></div>
                  <span>Must be at least 8 characters</span>
                </div>
                <div className={`flex items-center space-x-2 text-sm ${
                  /[!@#$%^&*(),.?":{}|<>]/.test(password) && /\d/.test(password) ? "text-green-600" : "text-gray-400"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    /[!@#$%^&*(),.?":{}|<>]/.test(password) && /\d/.test(password) ? "bg-green-500" : "bg-gray-300"
                  }`}></div>
                  <span>Must contain one special character and one number at least</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>
          </>
        );

      case "success":
        return (
          <>
            {/* Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <HiOutlineCheckCircle className="h-8 w-8 text-green-500" />
            </div>

            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Password reset
            </h2>
            <p className="text-sm text-gray-600 mb-8 text-center">
              Your password has been successfully reset.{" "}
              Click below to log in magically.
            </p>

            {/* Continue Button */}
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Continue
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-hide">
        {/* Customer Service Icon - Fixed Position */}
        <div className="fixed bottom-6 right-6 z-10">
          <button className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200">
            <RiCustomerServiceLine className="h-6 w-6" />
          </button>
        </div>

        {/* Content Container */}
        <div className="min-h-full flex flex-col">
          {/* Top Logo */}
          <div className="p-6">
            <Logo width={150} height={40} />
          </div>

          {/* Centered Form */}
          <div className="flex-1 flex items-start justify-center pt-8 pb-16 px-8">
            <div className="w-full max-w-md">
              {renderContent()}

              {/* Back to Login */}
              <div className="mt-8 text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}