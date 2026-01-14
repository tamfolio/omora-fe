// app/auth/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RiCustomerServiceLine } from "react-icons/ri";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const router = useRouter();

  // Load saved email if "remember me" was checked previously
  useEffect(() => {
    const savedEmail = localStorage.getItem("omora-remembered-email");
    const rememberMeStatus = localStorage.getItem("omora-remember-me");
    
    if (savedEmail && rememberMeStatus === "true") {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Save or clear email based on "remember me" checkbox
  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    
    if (checked && email) {
      localStorage.setItem("omora-remembered-email", email);
      localStorage.setItem("omora-remember-me", "true");
    } else {
      localStorage.removeItem("omora-remembered-email");
      localStorage.removeItem("omora-remember-me");
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem("omora-remembered-email", email);
      localStorage.setItem("omora-remember-me", "true");
    } else {
      localStorage.removeItem("omora-remembered-email");
      localStorage.removeItem("omora-remember-me");
    }

    try {
      // Step 1: Call custom API route for initial sign-in
      const response = await fetch("/api/auth/omora-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email,
          password: password,
          rememberMe: rememberMe, // Send remember me preference to backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
      } else if (data.requiresOtp) {
        // Show OTP modal
        setShowOtpModal(true);
        setLoading(false);
      }
    } catch (error) {
      setError("An error occurred during sign in");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 2: Verify OTP
      const response = await fetch("/api/auth/omora-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email,
          otp: otp,
          rememberMe: rememberMe, // Include remember me in verification
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid verification code");
        setLoading(false);
      } else if (data.success && data.user) {
        // Step 3: Sign in with NextAuth using the verified user data
        const result = await signIn("credentials", {
          email: data.user.email,
          password: "", // Not needed, we're using the token
          accessToken: data.user.accessToken,
          refreshToken: data.user.refreshToken || "",
          userId: data.user.id,
          userName: data.user.name,
          userRole: data.user.role,
          isFirstLogin: data.user.isFirstLogin?.toString() || "false",
          rememberMe: rememberMe.toString(), // Pass to NextAuth for session duration
          redirect: false,
        });

        if (result?.ok) {
          // Set a long-term cookie if remember me is checked
          if (rememberMe) {
            // Set a cookie that expires in 30 days
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            document.cookie = `omora-session-extended=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
          }

          // Check if first-time login
          if (data.user.isFirstLogin) {
            router.push("/firsttimelogin");
          } else {
            router.push("/dashboard");
          }
        } else {
          setError("Failed to establish session");
          setLoading(false);
        }
      }
    } catch (error) {
      setError("An error occurred during verification");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      // Resend OTP by calling sign-in again
      const response = await fetch("/api/auth/omora-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email,
          password: password,
          rememberMe: rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend code");
      } else {
        setOtp("");
        setError("");
      }
    } catch (error) {
      setError("Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification Modal
  if (showOtpModal) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="fixed bottom-6 right-6 z-10">
            <button className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200">
              <RiCustomerServiceLine className="h-6 w-6" />
            </button>
          </div>

          <div className="min-h-full flex flex-col">
            <div className="p-6">
              <Logo width={150} height={40} />
            </div>

            <div className="flex-1 flex items-start justify-center pt-8 pb-16 px-8">
              <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                    <Icon width={40} height={40} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Two-factor authentication
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-gray-900 text-sm font-medium mt-1">
                    {email}
                  </p>
                </div>

                <div className="space-y-6">
                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setOtp(value);
                        setError("");
                      }}
                      placeholder="000000"
                      className="w-full px-3 py-3 text-center text-2xl font-mono tracking-[0.5em] border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      disabled={loading}
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleOtpSubmit}
                    disabled={loading || otp.length !== 6}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify"
                    )}
                  </button>

                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?{" "}
                      <button
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-teal-600 hover:text-teal-500 font-medium"
                      >
                        {loading ? "Sending..." : "Click to resend"}
                      </button>
                    </p>
                    
                    <button
                      onClick={() => {
                        setShowOtpModal(false);
                        setOtp("");
                        setError("");
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                      disabled={loading}
                    >
                      ← Back to login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading && !showOtpModal) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="fixed bottom-6 right-6 z-10">
            <button className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200">
              <RiCustomerServiceLine className="h-6 w-6" />
            </button>
          </div>

          <div className="min-h-full flex flex-col">
            <div className="p-6">
              <Logo width={150} height={40} />
            </div>

            <div className="flex-1 flex items-center justify-center px-8">
              <div className="w-full max-w-md text-center space-y-8">
                <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                  <Icon width={40} height={40} />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Signing you in...
                  </h2>
                  <p className="text-sm text-gray-600">
                    Please wait while we verify your credentials
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Login Form
  return (
    <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="fixed bottom-6 right-6 z-10">
          <button className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200">
            <RiCustomerServiceLine className="h-6 w-6" />
          </button>
        </div>

        <div className="min-h-full flex flex-col">
          <div className="p-6">
            <Logo width={150} height={40} />
          </div>

          <div className="flex-1 flex items-start justify-center pt-8 pb-16 px-8">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                  <Icon width={40} height={40} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Log in to your account
                </h2>
                <p className="text-gray-600 text-sm">
                  Welcome back! Please enter your details.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleInitialSubmit}>
                {error && (
                  <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                    placeholder="oliviathomas@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Update saved email if remember me is checked
                      if (rememberMe) {
                        localStorage.setItem("omora-remembered-email", e.target.value);
                      }
                    }}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <FiEye className="h-4 w-4 text-gray-400" />
                      ) : (
                        <FiEyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => handleRememberMeChange(e.target.checked)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                      disabled={loading}
                    />
                    <span className="ml-2 text-gray-600">
                      Remember for 30 days
                    </span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-teal-600 hover:text-teal-500"
                  >
                    Forgot password
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sign in
                </button>

                <div className="text-center text-sm">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link
                    href="/auth/signup"
                    className="text-teal-600 hover:text-teal-500 font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}