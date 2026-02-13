import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Camera, RefreshCw } from "lucide-react";
import Logo from "../../Logo";
import kycApiService, { LivenessCheckInitiateRequest } from "@/lib/kyc-api-service";

interface FacialRecognitionProps {
  onNext: () => void;
  onBack: () => void;
  firstName?: string;
  lastName?: string;
  nin?: string;
  bvn?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE";
  phone?: string;
  status?: string;
}

declare global {
  interface Window {
    QoreIdRegenerateSDK: () => void;
    QoreIDWebSdk: {
      start: () => void;
    };
  }
}

function FacialRecognition({
  onNext,
  onBack,
  firstName,
  lastName,
  nin,
  bvn,
  dateOfBirth,
  gender,
  phone,
  status,
}: FacialRecognitionProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showManualButton, setShowManualButton] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerReference, setCustomerReference] = useState<string>("");
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);
  const pollAttemptsRef = useRef(0);

  // Load QoreID SDK
  useEffect(() => {
    if (document.querySelector('script[src*="qoreid.js"]')) return;

    const script = document.createElement("script");
    script.src = "https://dashboard.qoreid.com/qoreid-sdk/qoreid.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const startPolling = () => {
    console.log('🔄 Starting backend polling...');
    
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    pollAttemptsRef.current = 0;

    pollIntervalRef.current = setInterval(async () => {
      try {
        pollAttemptsRef.current += 1;

        // Check verification ping
        const status: any = await kycApiService.verificationPing();
        const isPingVerified =
          status?.status === "verified" || status?.data?.status === "verified";

        // Check /me for liveness status
        const meData: any = await kycApiService.getUserKycStatus();
        const livenessRecord = meData?.data?.verification?.find(
          (v: any) => v.type === "LIVENESS",
        );
        const isLivenessComplete = livenessRecord?.status === "C";

        // Check onboarding state
        const onboardingState = meData?.data?.onboardingState;
        const currentStep = onboardingState?.currentStep;
        const isOnDashboard = currentStep === "dashboard";
        const isMovedPastLiveness = currentStep !== "verify-liveness" && currentStep !== "facial-recognition";

        console.log(`📊 Poll #${pollAttemptsRef.current}:`, {
          isPingVerified,
          isLivenessComplete,
          currentStep,
          isMovedPastLiveness,
        });

        if (isPingVerified || isLivenessComplete || isMovedPastLiveness || isOnDashboard) {
          console.log('✅ Verification confirmed by backend!');
          stopPolling();
          setVerificationComplete(true);
          setIsVerifying(false);

          // Auto-redirect after 2 seconds
          setTimeout(() => {
            onNext();
          }, 2000);
        }

        // After 12 attempts (60 seconds), show manual continue
        if (pollAttemptsRef.current >= 12) {
          setShowContinueButton(true);
        }

        // Stop after 24 attempts (2 minutes)
        if (pollAttemptsRef.current >= 24) {
          console.log('⏰ Polling timeout reached');
          stopPolling();
          setShowContinueButton(true);
        }
      } catch (error) {
        console.error("❌ Polling error:", error);
      }
    }, 5000); // Poll every 5 seconds
  };

  const triggerQoreIDSDK = () => {
    if (hasStartedRef.current) {
      console.log('⚠️ SDK already started');
      return;
    }

    hasStartedRef.current = true;
    console.log('🎬 Triggering QoreID SDK...');

    try {
      const button = document.getElementById("QoreIDButton");
      console.log('🎥 QoreID Button:', button);
      
      if (button) {
        const newButton = button.cloneNode(true) as HTMLElement;
        button.parentNode?.replaceChild(newButton, button);

        // ✅ When user submits video, start polling backend
        newButton.addEventListener("qoreid:verificationSubmitted", (() => {
          console.log('✅ Video submitted to QoreID - starting backend polling');
          startPolling();
        }) as EventListener);

        newButton.addEventListener("qoreid:verificationError", ((event: any) => {
          console.error('❌ QoreID Error:', event);
          stopPolling();
          setIsVerifying(false);
          setError("Verification process failed. Please try again.");
          hasStartedRef.current = false;
        }) as EventListener);

        newButton.addEventListener("qoreid:verificationClosed", (() => {
          console.log('🚪 QoreID Modal closed');
          setIsVerifying(false);
          setShowManualButton(false);
          hasStartedRef.current = false;
        }) as EventListener);

        // Additional events for debugging
        newButton.addEventListener("qoreid:opened", (() => {
          console.log('🎬 QoreID Modal opened');
        }) as EventListener);

        newButton.addEventListener("qoreid:success", (() => {
          console.log('🎉 QoreID Success event');
          startPolling();
        }) as EventListener);
      }

      if (window.QoreIdRegenerateSDK) {
        console.log('🔄 Regenerating SDK...');
        window.QoreIdRegenerateSDK();
      }

      if (window.QoreIDWebSdk) {
        console.log('▶️ Starting QoreID WebSDK...');
        window.QoreIDWebSdk.start();

        setTimeout(() => {
          if (isVerifying && !verificationComplete) {
            console.log('⏰ Showing manual retry button');
            setShowManualButton(true);
          }
        }, 5000);
      } else {
        console.error('❌ QoreIDWebSdk not found');
        setShowManualButton(true);
        hasStartedRef.current = false;
      }
    } catch (err) {
      console.error('❌ SDK Error:', err);
      setShowManualButton(true);
      hasStartedRef.current = false;
    }
  };

  const handleContinue = async () => {
    if (!nin || !bvn) {
      setError("NIN and BVN are required");
      return;
    }

    setError(null);
    setShowManualButton(false);
    hasStartedRef.current = false;

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());

      await initiateVerification();
    } catch (error: any) {
      setError("Camera access is required. Please check permissions.");
    }
  };

  const initiateVerification = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      // ✅ Format date as DD-MM-YYYY
      const dobString = dateOfBirth || '';
      const formattedDob = dobString.replace(/\//g, '-');

      console.log('🎥 Initiating liveness check:', {
        dob: formattedDob,
        gender: gender || 'MALE',
        idNumber: bvn,
      });

      const verificationData: LivenessCheckInitiateRequest = {
        dob: formattedDob,
        gender: (gender || "MALE") as "MALE" | "FEMALE",
        idNumber: bvn || "",
        employmentStatus: "Employed",
        pep: "salary",
      };

      const response = await kycApiService.initiateLivenessCheck(verificationData);
      console.log('🎥 Liveness response:', response);
      
      const custRef = response?.data?.reference;

      if (!custRef) {
        throw new Error("No reference returned from backend");
      }

      console.log('✅ Got reference:', custRef);
      setCustomerReference(custRef);

      // Wait for QoreID button to be ready
      setTimeout(() => {
        triggerQoreIDSDK();
      }, 1000);
    } catch (err: any) {
      console.error('❌ Initiation error:', err);
      setIsVerifying(false);
      setError(err.message || "Failed to initialize verification session");
    }
  };

  const handleRetry = () => {
    console.log('🔄 Manual retry...');
    hasStartedRef.current = false;
    triggerQoreIDSDK();
  };

  const clientId = process.env.NEXT_PUBLIC_QOREID_CLIENT_ID || "";
  const applicantData = JSON.stringify({
    firstname: firstName || "",
    lastname: lastName || "",
    phone: phone || "",
    email: "",
  });

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm">
        <button
          onClick={onBack}
          disabled={isVerifying}
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <Logo width={150} height={40} />
      </div>

      {/* Hidden QoreID Button */}
      {customerReference && (
        <div style={{ height: 0, overflow: "hidden" }}>
          <div
            dangerouslySetInnerHTML={{
              __html: `
            <qoreid-button
              id="QoreIDButton"
              clientId="${clientId}"
              productCode="liveness"
              customerReference="${customerReference}"
              applicantData='${applicantData}'
            ></qoreid-button>
          `,
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">Facial Recognition</h1>

          {/* Start State */}
          {!isVerifying && (
            <div className="space-y-6">
              <p className="text-gray-600">
                Please complete the video verification.
              </p>
              {status === 'F' && (
                <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
                  Previous attempt failed. Please ensure good lighting and try again.
                </p>
              )}
              <button
                onClick={handleContinue}
                className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                {status === 'F' ? 'Retry Verification' : 'Start Verification'}
              </button>
            </div>
          )}

          {/* Complete State */}
          {isVerifying && verificationComplete && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
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
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">
                  Verification Complete!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Verifying State */}
          {isVerifying && !verificationComplete && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">
                  Verification in progress...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {showContinueButton
                    ? "Waiting for confirmation..."
                    : "Connecting to secure server..."}
                </p>
              </div>

              {/* Manual Retry Button */}
              {showManualButton && !showContinueButton && (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
                  <p className="text-sm text-orange-700 mb-3">
                    Popup didn't open?
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded flex items-center justify-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Launch Camera
                  </button>
                </div>
              )}

              {/* Manual Continue Button */}
              {showContinueButton && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 mb-3">
                    Verification may be complete. Click below to continue.
                  </p>
                  <button
                    onClick={() => {
                      stopPolling();
                      onNext();
                    }}
                    className="w-full px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <p className="text-red-500 mt-4 bg-red-50 p-3 rounded">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacialRecognition;