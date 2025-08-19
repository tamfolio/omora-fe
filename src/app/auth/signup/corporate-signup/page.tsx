// components/auth/CorporateSignup.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
      const businessName = value ? `RC - ${value}` : "";
      setFormData((prev) => ({ ...prev, businessName }));
    }
    
    if (field === "email") {
      setEmailError("");
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
        throw new Error("Failed to check email");
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
      onError("Password must be at least 8 characters and include a symbol, uppercase/lowercase");
      setLoading(false);
      return;
    }

    if (emailError) {
      onError("Please resolve the email issue before continuing");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          accountType: "corporate",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        onError(result.error || "An error occurred during sign up");
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error("Signup error:", error);
      onError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {/* RC Number */}
      <div>
        <label htmlFor="rcNumber" className="block text-xs font-medium text-gray-700 mb-1">
          RC Number *
        </label>
        <input
          id="rcNumber"
          type="text"
          required
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
          placeholder="35478990987"
          value={formData.rcNumber}
          onChange={(e) => handleChange("rcNumber", e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className="block text-xs font-medium text-gray-700 mb-1">
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
        <p className="text-xs text-gray-500 mt-0.5">Auto-populated based on RC Number</p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
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
        {emailError && <p className="text-xs text-red-500 mt-0.5">{emailError}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
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
        <p className="text-xs text-gray-500 mt-0.5">8+ characters, symbol, uppercase/lowercase</p>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
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
          <Link href="/terms" className="text-teal-600 hover:text-teal-500">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-teal-600 hover:text-teal-500">Privacy Policy</Link>
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