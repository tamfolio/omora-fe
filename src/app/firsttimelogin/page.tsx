"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiCustomerServiceLine } from "react-icons/ri";
import {
  HiOutlineX,
  HiOutlineShieldCheck,
  HiOutlineMail,
  HiOutlineArrowRight,
  HiOutlineClipboardCopy,
} from "react-icons/hi";
import Logo from "@/components/ui/Logo";

export default function FirstTimeLogin() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthenticatorModal, setShowAuthenticatorModal] = useState(false);
  const [showManualCodeModal, setShowManualCodeModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  const [manualCode, setManualCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const qrCode = "4K3DDKUW748H4CO";
  const router = useRouter();

  const verificationSteps = [
    {
      id: 1,
      title: "Authenticator app",
      icon: HiOutlineShieldCheck,
      description: "Set up two-factor authentication",
    },
    {
      id: 2,
      title: "Email",
      icon: HiOutlineMail,
      description: "Verify your email address",
    },
  ];

  const handleStepClick = (stepId: number) => {
    if (completedSteps.includes(stepId)) return;

    if (stepId === 1) {
      setShowAuthenticatorModal(true);
    } else if (stepId === 2) {
      setShowEmailVerificationModal(true);
    } else {
      setCurrentStep(stepId);
      setLoading(true);
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepId]);
        setCurrentStep(null);
        setLoading(false);

        if (completedSteps.length + 1 === verificationSteps.length) {
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      }, 2000);
    }
  };

  const handleAuthenticatorNext = () => {
    setShowAuthenticatorModal(false);
    setShowManualCodeModal(true);
  };

  const handleManualCodeSubmit = () => {
    if (manualCode.length === 6) {
      setShowManualCodeModal(false);
      setCompletedSteps((prev) => [...prev, 1]);
      setManualCode("");
    }
  };

  const handlePasteCode = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        const cleanCode = text.replace(/\s/g, "").slice(0, 6);
        if (/^\d{1,6}$/.test(cleanCode)) {
          setManualCode(cleanCode);
        }
      })
      .catch(() => {
        // Clipboard access failed, ignore
      });
  };

  const handleEmailVerificationSubmit = () => {
    if (emailCode.length === 6) {
      setShowEmailVerificationModal(false);
      setCompletedSteps((prev) => [...prev, 2]);
      setEmailCode("");
    }
  };

  const handlePasteEmailCode = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        const cleanCode = text.replace(/\s/g, "").slice(0, 6);
        if (/^\d{1,6}$/.test(cleanCode)) {
          setEmailCode(cleanCode);
        }
      })
      .catch(() => {
        // Clipboard access failed, ignore
      });
  };

  const handleResendEmailCode = () => {
    // Implement resend logic here
    console.log("Resending email verification code");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode);
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const allStepsCompleted = completedSteps.length === verificationSteps.length;
  const progress = `${completedSteps.length} / ${verificationSteps.length}`;

  return (
    <div className="h-screen bg-gray-800 flex flex-col relative overflow-hidden">
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

          {/* Centered Modal */}
          <div className="flex-1 flex items-center justify-center px-8">
            {/* Email Verification Modal */}
            {showEmailVerificationModal ? (
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowEmailVerificationModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <HiOutlineX className="h-5 w-5 text-gray-400" />
                </button>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Header */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                    Email Verification
                  </h2>
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    We sent a 6-digit code to olivia@gmail.com
                  </p>

                  {/* Input Section */}
                  <div className="mb-4">
                    <label
                      htmlFor="emailCode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="emailCode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={emailCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setEmailCode(value);
                        }}
                        placeholder="000000"
                        className="w-full px-3 py-3 pr-16 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center text-lg font-mono tracking-widest"
                      />
                      <button
                        onClick={handlePasteEmailCode}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-500 text-sm font-medium"
                      >
                        Paste
                      </button>
                    </div>
                  </div>

                  {/* Resend Link */}
                  <div className="mb-6 text-center">
                    <p className="text-sm text-gray-600">
                      Didn&apos;t receive the 6-digit code?{" "}
                      <button
                        onClick={handleResendEmailCode}
                        className="text-teal-600 hover:text-teal-500 font-medium"
                      >
                        Click to resend
                      </button>
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleEmailVerificationSubmit}
                    disabled={emailCode.length !== 6}
                    className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : showManualCodeModal ? (
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowManualCodeModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <HiOutlineX className="h-5 w-5 text-gray-400" />
                </button>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Header */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Authenticator App Verification
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Enter the 6-digit code generated by the authenticator app.
                  </p>

                  {/* Input Section */}
                  <div className="mb-6">
                    <label
                      htmlFor="manualCode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Input 6-digit code
                    </label>
                    <div className="relative">
                      <input
                        id="manualCode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={manualCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setManualCode(value);
                        }}
                        placeholder="000000"
                        className="w-full px-3 py-3 pr-16 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center text-lg font-mono tracking-widest"
                      />
                      <button
                        onClick={handlePasteCode}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-500 text-sm font-medium"
                      >
                        Paste
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleManualCodeSubmit}
                    disabled={manualCode.length !== 6}
                    className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : showAuthenticatorModal ? (
              /* Authenticator Setup Modal */
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowAuthenticatorModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <HiOutlineX className="h-5 w-5 text-gray-400" />
                </button>

                {/* Modal Content */}
                <div className="p-6 text-center">
                  {/* Header */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Link an Authenticator
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Scan this QR code in the authenticator app
                  </p>

                  {/* QR Code Placeholder */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                      {/* QR Code Pattern Simulation */}
                      <div className="w-44 h-44 bg-black relative">
                        <div className="absolute inset-2 bg-white"></div>
                        <div className="absolute inset-4 bg-black"></div>
                        <div className="absolute inset-6 bg-white"></div>
                        <div className="absolute inset-8 bg-black"></div>
                        <div className="absolute inset-10 bg-white"></div>
                        <div className="absolute inset-12 bg-black"></div>
                        <div className="absolute inset-14 bg-white"></div>
                        <div className="absolute inset-16 bg-black"></div>
                        <div className="text-white text-xs absolute bottom-2 left-2 right-2 text-center font-mono">
                          QR CODE
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual Code */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
                      <span className="font-mono text-sm text-gray-700">
                        {qrCode}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        <HiOutlineClipboardCopy className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Help Text */}
                  <p className="text-xs text-gray-500 mb-6">
                    If you are unable to scan the QR Code, please enter this
                    code manually into the app.
                  </p>

                  {/* Next Button */}
                  <button
                    onClick={handleAuthenticatorNext}
                    className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              /* Main Security Requirements Modal */
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
                {/* Close Button */}
                <button
                  onClick={handleSkip}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <HiOutlineX className="h-5 w-5 text-gray-400" />
                </button>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Security Verification Requirements
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      You need to complete all of the following verifications to
                      continue.
                    </p>

                    {/* Progress */}
                    <div className="text-2xl font-bold text-teal-600 mb-4">
                      {progress}
                    </div>
                  </div>

                  {/* Verification Steps */}
                  <div className="space-y-3 mb-6">
                    {verificationSteps.map((step) => {
                      const isCompleted = completedSteps.includes(step.id);
                      const isActive = currentStep === step.id;
                      const IconComponent = step.icon;

                      return (
                        <button
                          key={step.id}
                          onClick={() => handleStepClick(step.id)}
                          disabled={isCompleted || loading}
                          className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all ${
                            isCompleted
                              ? "bg-green-50 border-green-200 cursor-default"
                              : isActive
                                ? "bg-teal-50 border-teal-200"
                                : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          } ${loading && !isActive ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? "bg-green-100 text-green-600"
                                  : isActive
                                    ? "bg-teal-100 text-teal-600"
                                    : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {isCompleted ? (
                                <HiOutlineShieldCheck className="h-5 w-5" />
                              ) : (
                                <IconComponent className="h-5 w-5" />
                              )}
                            </div>
                            <div className="text-left">
                              <div
                                className={`font-medium ${
                                  isCompleted
                                    ? "text-green-900"
                                    : isActive
                                      ? "text-teal-900"
                                      : "text-gray-900"
                                }`}
                              >
                                {step.title}
                              </div>
                              {isActive && (
                                <div className="text-sm text-teal-600">
                                  Setting up...
                                </div>
                              )}
                              {isCompleted && (
                                <div className="text-sm text-green-600">
                                  Completed
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            {isCompleted ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <HiOutlineShieldCheck className="h-4 w-4 text-white" />
                              </div>
                            ) : isActive ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                            ) : (
                              <HiOutlineArrowRight className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="text-center">
                    {allStepsCompleted ? (
                      <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mb-4"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        onClick={handleSkip}
                        className="text-sm text-teal-600 hover:text-teal-500 font-medium"
                      >
                        Security verification unavailable?
                      </button>
                    )}
                  </div>

                  {allStepsCompleted && (
                    <div className="text-center">
                      <button
                        onClick={handleSkip}
                        className="text-sm text-teal-600 hover:text-teal-500 font-medium"
                      >
                        Security verification unavailable?
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
