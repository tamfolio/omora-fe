"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";

interface CorporateSignupProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function CorporateSignup({
  onSuccess,
  onError,
  loading,
  setLoading,
}: CorporateSignupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showRcTypeDropdown, setShowRcTypeDropdown] = useState(false);
  const [rcType, setRcType] = useState<'rc' | 'bn'>('bn');
  const router = useRouter();

  const [formData, setFormData] = useState({
    rcNumber: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-populate business name from RC number
    if (field === "rcNumber") {
      const businessName = value ? `${rcType.toUpperCase()} - ${value}` : "";
      setFormData((prev) => ({ ...prev, businessName }));
    }

    if (field === "email") {
      setEmailError("");
    }
  };

  const handleRcTypeChange = (newType: 'rc' | 'bn') => {
    setRcType(newType);
    setShowRcTypeDropdown(false);
    // Update business name with new type
    if (formData.rcNumber) {
      const businessName = `${newType.toUpperCase()} - ${formData.rcNumber}`;
      setFormData((prev) => ({ ...prev, businessName }));
    }
  };

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    return (
      password.length >= minLength &&
      hasSymbol &&
      (hasUppercase || hasLowercase)
    );
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleEmailBlur = async (email: string) => {
    if (email && email.includes("@")) {
      const exists = await checkEmailExists(email);
      if (exists) {
        setEmailError("Email already exists");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    onError("");

    if (!acceptTerms) {
      onError("Please accept the Terms and Privacy Policy");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      onError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      onError(
        "Password must be at least 8 characters and include a symbol, uppercase/lowercase",
      );
      setLoading(false);
      return;
    }

    if (emailError) {
      onError("Please resolve the email issue before continuing");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Call signup API
      const response = await fetch("/api/auth/omora-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.businessName,
          lastName: "Corporate",
          middleName: "",
          emailAddress: formData.email,
          password: formData.password,
          rcType: rcType,
          rcNumber: formData.rcNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        onError(result.error || "An error occurred during sign up");
        setLoading(false);
      } else if (result.requiresOtp) {
        setShowOtpModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      onError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      onError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    onError("");

    try {
      const response = await fetch("/api/auth/omora-signup-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: formData.email,
          otp: otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        onError(result.error || "Invalid verification code");
        setLoading(false);
      } else {
        router.push("/auth/login?message=Account created successfully");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      onError("An error occurred during verification");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    onError("");

    try {
      const response = await fetch("/api/auth/omora-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.businessName,
          lastName: "Corporate",
          middleName: "",
          emailAddress: formData.email,
          password: formData.password,
          rcType: rcType,
          rcNumber: formData.rcNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        onError(result.error || "Failed to resend code");
      } else {
        setOtp("");
      }
    } catch (error) {
      onError("Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // OTP Modal
  if (showOtpModal) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Verify your email
          </h3>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to {formData.email}
          </p>
        </div>

        <div>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setOtp(value);
              onError("");
            }}
            placeholder="000000"
            className="w-full px-3 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            disabled={loading}
            autoFocus
          />
        </div>

        <button
          onClick={handleOtpSubmit}
          disabled={loading || otp.length !== 6}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="text-teal-600 hover:text-teal-500 font-medium"
            >
              {loading ? "Sending..." : "Resend"}
            </button>
          </p>
          <button
            onClick={() => {
              setShowOtpModal(false);
              setOtp("");
              onError("");
            }}
            className="text-sm text-gray-600 hover:text-gray-900 mt-2"
            disabled={loading}
          >
            ← Back to signup
          </button>
        </div>
      </div>
    );
  }

  // Main signup form
  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {/* RC Number with Dropdown */}
      <div>
        <label
          htmlFor="rcNumber"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          RC Number *
        </label>
        <div className="relative">
          {/* Dropdown Button */}
          <button
            type="button"
            onClick={() => setShowRcTypeDropdown(!showRcTypeDropdown)}
            className="absolute left-0 top-0 bottom-0 px-2 flex items-center space-x-1 text-gray-700 border-r border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors z-10 rounded-l-md"
            disabled={loading}
          >
            <FiChevronDown className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-medium">{rcType.toUpperCase()} -</span>
          </button>
          
          {/* Input */}
          <input
            id="rcNumber"
            type="text"
            required
            className="w-full pl-16 pr-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
            placeholder="35478990987"
            value={formData.rcNumber}
            onChange={(e) => handleChange("rcNumber", e.target.value.replace(/\D/g, '').slice(0, 10))}
            disabled={loading}
          />

          {/* Dropdown Menu */}
          {showRcTypeDropdown && (
            <>
              <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-20">
                <button
                  type="button"
                  onClick={() => handleRcTypeChange('rc')}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors rounded-t-md"
                >
                  RC
                </button>
                <button
                  type="button"
                  onClick={() => handleRcTypeChange('bn')}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors rounded-b-md"
                >
                  BN
                </button>
              </div>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowRcTypeDropdown(false)}
              />
            </>
          )}
        </div>
      </div>

      {/* Business Name */}
      <div>
        <label
          htmlFor="businessName"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Business Name
        </label>
        <input
          id="businessName"
          type="text"
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs bg-gray-50"
          placeholder="Adenifuja Business Enterprise"
          value={formData.businessName}
          readOnly
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-0.5">
          Auto-populated based on RC Number
        </p>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Email *
        </label>
        <input
          id="email"
          type="email"
          required
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={(e) => handleEmailBlur(e.target.value)}
          disabled={loading}
        />
        {emailError && (
          <p className="text-xs text-red-500 mt-0.5">{emailError}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-2 py-1.5 pr-8 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-2 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? (
              <FiEye className="h-3 w-3 text-gray-400" />
            ) : (
              <FiEyeOff className="h-3 w-3 text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          8+ characters, symbol, uppercase/lowercase
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            className="w-full px-2 py-1.5 pr-8 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-2 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
          >
            {showConfirmPassword ? (
              <FiEye className="h-3 w-3 text-gray-400" />
            ) : (
              <FiEyeOff className="h-3 w-3 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Terms and Privacy Policy */}
      <div className="flex items-start text-xs">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="h-3 w-3 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-0.5 mr-2 flex-shrink-0"
          disabled={loading}
        />
        <span className="text-gray-600">
          I accept the{" "}
          <Link href="/terms" className="text-teal-600 hover:text-teal-500">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-teal-600 hover:text-teal-500">
            Privacy Policy
          </Link>
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !acceptTerms || !!emailError}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {loading ? "Creating account..." : "Get started"}
      </button>
    </form>
  );
}