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
  const [isPolling, setIsPolling] = useState(false);

  const hasStartedRef = useRef(false);

  // Load QoreID SDK
  useEffect(() => {
    if (document.querySelector('script[src*="qoreid.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://dashboard.qoreid.com/qoreid-sdk/qoreid.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ Corrected startPolling logic
  const startPolling = async () => {
    setIsPolling(true);
    setError(null);
    
    let attempts = 0;
    const maxAttempts = 6; 

    const poll = async () => {
      try {
        const response = await kycApiService.pollOnboarding('liveness');
        
        if (response.status === 'success') {
          setVerificationComplete(true);
          setIsPolling(false);
          setTimeout(() => onNext(), 1500);
          return;
        } 
        
        if (response.status === 'failed') {
          setIsPolling(false);
          setError(response.message || "Liveness check failed.");
          handleRetry(); 
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000); 
        } else {
          setIsPolling(false);
          setIsVerifying(false); 
          setError("Verification is taking longer than expected. Please try again.");
        }
      } catch (err: any) {
        setIsPolling(false);
        setError("Unable to reach the server. Please check your connection.");
      }
    };

    poll();
  };

  const triggerQoreIDSDK = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    try {
      const button = document.getElementById("QoreIDButton");
      if (button) {
        const newButton = button.cloneNode(true) as HTMLElement;
        button.parentNode?.replaceChild(newButton, button);

        newButton.addEventListener("qoreid:verificationError", ((event: any) => {
          setIsVerifying(false);
          setError("Verification process failed. Please try again.");
          hasStartedRef.current = false;
        }) as EventListener);

        newButton.addEventListener('qoreid:verificationClosed', () => {
          startPolling(); 
        });

        newButton.addEventListener("qoreid:success", (() => {
          startPolling();
        }) as EventListener);
      }

      if (window.QoreIdRegenerateSDK) window.QoreIdRegenerateSDK();
      if (window.QoreIDWebSdk) {
        window.QoreIDWebSdk.start();
        setTimeout(() => {
          if (isVerifying && !verificationComplete) setShowManualButton(true);
        }, 5000);
      } else {
        setShowManualButton(true);
        hasStartedRef.current = false;
      }
    } catch (err) {
      setShowManualButton(true);
      hasStartedRef.current = false;
    }
  };

  const handleContinue = async () => {
    if (!nin || !bvn) return setError("NIN and BVN are required");
    setError(null);
    setShowManualButton(false);
    hasStartedRef.current = false;

    try {
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
      const dobString = dateOfBirth || '';
      // Ensure DD/MM/YYYY format for liveness payload
      const parts = dobString.split(/[-/]/);
      const formattedDob = parts.length === 3 ? `${parts[0]}/${parts[1]}/${parts[2]}` : dobString;

      const verificationData: LivenessCheckInitiateRequest = {
        dob: formattedDob,
        gender: (gender || "MALE") as "MALE" | "FEMALE",
        idNumber: bvn || "",
        employmentStatus: "Employed",
        pep: "salary",
      };

      const response = await kycApiService.initiateLivenessCheck(verificationData);
      const custRef = response?.data?.reference;

      if (!custRef) throw new Error("No reference returned from backend");

      setCustomerReference(custRef);
      setTimeout(() => triggerQoreIDSDK(), 1000);
    } catch (err: any) {
      setIsVerifying(false);
      setError(err.message || "Failed to initialize verification session");
    }
  };

  const handleRetry = () => {
    hasStartedRef.current = false;
    setIsVerifying(false);
    setCustomerReference("");
    setError(null);
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
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm">
        <button 
          onClick={onBack} 
          disabled={isVerifying || isPolling} 
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <Logo width={150} height={40} />
      </div>

      {customerReference && (
        <div style={{ height: 0, overflow: 'hidden' }}>
          <div dangerouslySetInnerHTML={{__html: `
            <qoreid-button
              id="QoreIDButton"
              clientId="${clientId}"
              productCode="liveness"
              customerReference="${customerReference}"
              applicantData='${applicantData}'
            ></qoreid-button>
          `}} />
        </div>
      )}

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">Facial Recognition</h1>
          
          {isPolling ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-semibold text-gray-800 text-lg">Finalizing your verification...</p>
              <p className="text-sm text-gray-500">Communicating with verification servers.</p>
            </div>
          ) : !isVerifying && status !== 'BVP' ? (
            <div className="space-y-6">
              <p className="text-gray-600">Please complete the video verification.</p>
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
          ) : (status === 'BVP' || isVerifying) && !verificationComplete ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-semibold text-gray-800 text-lg">
                {status === 'BVP' ? 'Reviewing Session...' : 'Verification in progress...'}
              </p>
              {showManualButton && (
                <button onClick={handleRetry} className="flex items-center gap-2 text-orange-600 font-medium mx-auto">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              )}
            </div>
          ) : verificationComplete && (
             <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-gray-800 text-lg">Submitted Successfully</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4">
              <p className="text-red-500 bg-red-50 p-3 rounded mb-3">{error}</p>
              <button onClick={handleRetry} className="text-teal-600 text-sm font-medium hover:underline">
                Reset and try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacialRecognition;