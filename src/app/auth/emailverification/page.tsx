"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RiCustomerServiceLine } from "react-icons/ri";
import { HiOutlineMail } from "react-icons/hi";
import Logo from "@/components/ui/Logo";

export default function EmailVerification() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ;

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take the last character
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    setError("");
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 3 : Math.min(nextEmptyIndex, 3);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 4) {
      setError("Please enter the complete 4-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Invalid verification code");
      } else {
        // Redirect to login or dashboard
        router.push("/auth/login?message=Email verified successfully");
      }
    } catch (error) {
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to resend code");
      } else {
        setTimeLeft(60);
        setCanResend(false);
        setCode(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
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

          {/* Centered Verification Form */}
          <div className="flex-1 flex items-start justify-center pt-8 pb-16 px-8">
            <div className="w-full max-w-md space-y-8">
              {/* Mail Icon and Title */}
              <div className="text-center">
                <div className="mx-auto mb-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <HiOutlineMail className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-gray-600">
                  We sent a verification link to{" "}
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
              </div>

              {/* Verification Code Input */}
              <div className="space-y-6">
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <div className="flex justify-center space-x-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      disabled={loading}
                    />
                  ))}
                </div>

                {/* Verify Email Button */}
                <button
                  onClick={handleVerify}
                  disabled={loading || code.some(digit => !digit)}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify email"}
                </button>
              </div>

              {/* Resend Section */}
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Didn&apos;t receive the email?{" "}
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="text-teal-600 hover:text-teal-500 font-medium"
                    >
                      {isResending ? "Sending..." : "Click to resend"}
                    </button>
                  ) : (
                    <span className="text-gray-400">
                      Resend in {formatTime(timeLeft)}
                    </span>
                  )}
                </p>

                {/* Back to Login */}
                <div className="pt-4">
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
    </div>
  );
}