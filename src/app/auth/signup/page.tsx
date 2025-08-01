"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RiCustomerServiceLine } from "react-icons/ri";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";

export default function Signup() {
  const [accountType, setAccountType] = useState("individual"); // "individual" or "corporate"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const router = useRouter();

  // Individual form fields
  const [individualData, setIndividualData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Corporate form fields
  const [corporateData, setCorporateData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleIndividualChange = (field: string, value: string) => {
    setIndividualData((prev) => ({ ...prev, [field]: value }));
    if (field === "email") {
      setEmailError("");
    }
  };

  const handleCorporateChange = (field: string, value: string) => {
    setCorporateData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!acceptTerms) {
      setError("Please accept the Terms and Privacy Policy");
      setLoading(false);
      return;
    }

    const data = accountType === "individual" ? individualData : corporateData;

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!validatePassword(data.password)) {
      setError(
        "Password must be at least 8 characters and include a symbol, uppercase/lowercase"
      );
      setLoading(false);
      return;
    }

    if (emailError) {
      setError("Please resolve the email issue before continuing");
      setLoading(false);
      return;
    }

    try {
      // Callm signup API endpoint
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          accountType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "An error occurred during sign up");
      } else {
        // Redirect to login page after successful signup
        router.push("/auth/login?message=Account created successfully");
      }
    } catch (error) {
      setError("An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const currentData =
    accountType === "individual" ? individualData : corporateData;

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
          <div className="p-8">
            <Logo width={150} height={40} />
          </div>

          {/* Centered Signup Form */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
              {/* Center Logo */}
              <div className="text-center">
                <div className="mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                  <Icon width={40} height={40} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Create an account
                </h2>
              </div>

              {/* Account Type Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setAccountType("individual")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                    accountType === "individual"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("corporate")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                    accountType === "corporate"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Corporate
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                {/* Individual Fields */}
                {accountType === "individual" && (
                  <>
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                        placeholder="John"
                        value={individualData.firstName}
                        onChange={(e) =>
                          handleIndividualChange("firstName", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="middleName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Middle Name (Optional)
                      </label>
                      <input
                        id="middleName"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                        placeholder="Bryan"
                        value={individualData.middleName}
                        onChange={(e) =>
                          handleIndividualChange("middleName", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                        placeholder="Edison"
                        value={individualData.lastName}
                        onChange={(e) =>
                          handleIndividualChange("lastName", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </>
                )}

                {/* Corporate Fields */}
                {accountType === "corporate" && (
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Business Name *
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter your business name"
                      value={corporateData.businessName}
                      onChange={(e) =>
                        handleCorporateChange("businessName", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Email Field (Common) */}
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
                    placeholder={
                      accountType === "individual"
                        ? "oliviathomas@gmail.com"
                        : "Enter your email"
                    }
                    value={currentData.email}
                    onChange={(e) =>
                      accountType === "individual"
                        ? handleIndividualChange("email", e.target.value)
                        : handleCorporateChange("email", e.target.value)
                    }
                    onBlur={(e) => handleEmailBlur(e.target.value)}
                    disabled={loading}
                  />
                  {emailError && (
                    <p className="text-xs text-red-500 mt-1">{emailError}</p>
                  )}
                </div>

                {/* Password Field */}
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
                      value={currentData.password}
                      onChange={(e) =>
                        accountType === "individual"
                          ? handleIndividualChange("password", e.target.value)
                          : handleCorporateChange("password", e.target.value)
                      }
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
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters and include a symbol,
                    uppercase/lowercase
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Confirm password"
                      value={currentData.confirmPassword}
                      onChange={(e) =>
                        accountType === "individual"
                          ? handleIndividualChange(
                              "confirmPassword",
                              e.target.value
                            )
                          : handleCorporateChange(
                              "confirmPassword",
                              e.target.value
                            )
                      }
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <FiEye className="h-4 w-4 text-gray-400" />
                      ) : (
                        <FiEyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms and Privacy Policy */}
                <div className="flex items-start text-sm">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-0.5 mr-2"
                    disabled={loading}
                  />
                  <span className="text-gray-600">
                    I accept the{" "}
                    <Link
                      href="/terms"
                      className="text-teal-600 hover:text-teal-500"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-teal-600 hover:text-teal-500"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                {/* Get Started button */}
                <button
                  type="submit"
                  disabled={loading || !acceptTerms || !!emailError}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account..." : "Get started"}
                </button>

                {/* OR divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">OR</span>
                  </div>
                </div>

                {/* Login link */}
                <div className="text-center text-sm">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link
                    href="/auth/login"
                    className="text-teal-600 hover:text-teal-500 font-medium"
                  >
                    Log in
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