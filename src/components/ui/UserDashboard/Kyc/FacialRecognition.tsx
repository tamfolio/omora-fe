import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, RefreshCw } from 'lucide-react';
import Logo from '../../Logo';
import kycApiService from '@/lib/kyc-api-service';

interface FacialRecognitionProps {
  onNext: () => void;
  onBack: () => void;
  firstName?: string;
  lastName?: string;
  nin?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  phone?: string;
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
  dateOfBirth, 
  gender,
  phone
}: FacialRecognitionProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showManualButton, setShowManualButton] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerReference, setCustomerReference] = useState<string>('');
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  // Load QoreID SDK
  useEffect(() => {
    if (document.querySelector('script[src*="qoreid.js"]')) return;

    const script = document.createElement('script');
    script.src = 'https://dashboard.qoreid.com/qoreid-sdk/qoreid.js';
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
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const status: any = await kycApiService.verificationPing();
        const isVerified = status?.status === 'verified' || status?.data?.status === 'verified';
        
        if (isVerified) {
          stopPolling();
          onNext();
        }
      } catch (error) {
        // Silent fail - continue polling
      }
    }, 5000);
  };

  const triggerQoreIDSDK = () => {
    if (hasStartedRef.current) return;
    
    hasStartedRef.current = true;

    try {
      const button = document.getElementById('QoreIDButton');
      if (button) {
        const newButton = button.cloneNode(true) as HTMLElement;
        button.parentNode?.replaceChild(newButton, button);

        newButton.addEventListener('qoreid:verificationSubmitted', (() => {
          startPolling();
        }) as EventListener);

        newButton.addEventListener('qoreid:verificationError', (() => {
          stopPolling();
          setIsVerifying(false);
          setError('Verification process failed.');
          hasStartedRef.current = false;
        }) as EventListener);

        newButton.addEventListener('qoreid:verificationClosed', () => {
          setIsVerifying(false);
          setShowManualButton(false);
          hasStartedRef.current = false;
        });
      }

      if (window.QoreIdRegenerateSDK) {
        window.QoreIdRegenerateSDK();
      }

      if (window.QoreIDWebSdk) {
        window.QoreIDWebSdk.start();
        
        setTimeout(() => {
          if (isVerifying) setShowManualButton(true);
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
    if (!nin) return setError('NIN required');
    
    setError(null);
    setShowManualButton(false);
    hasStartedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      
      await initiateVerification();
    } catch (error: any) {
      setError('Camera access is required. Please check permissions.');
    }
  };

  const initiateVerification = async () => {
    setIsVerifying(true);
    
    try {
      const verificationData = {
        type: 'NIN' as const,
        value: nin || '',
        dob: dateOfBirth || '',
        gender: gender || 'MALE',
        employmentStatus: '',
        pep: '' 
      };

      const response = await kycApiService.initiateLivenessCheck(verificationData);
      const custRef = (response as any)?.data?.reference || (response as any)?.reference;

      if (!custRef) throw new Error('No reference returned from backend');

      setCustomerReference(custRef);

      setTimeout(() => {
        triggerQoreIDSDK();
      }, 1000);

    } catch (err: any) {
      setIsVerifying(false);
      setError(err.message || 'Failed to initialize session');
    }
  };

  const clientId = process.env.NEXT_PUBLIC_QOREID_CLIENT_ID || '';
  const applicantData = JSON.stringify({ 
    firstname: firstName || '', 
    lastname: lastName || '',
    phone: phone || '',
    email: ''
  });

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} disabled={isVerifying} className="p-2 hover:bg-gray-100 rounded-full">
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
              productCode="liveness_nin"
              customerReference="${customerReference}"
              applicantData='${applicantData}'
            ></qoreid-button>
          `}} />
        </div>
      )}

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">Facial Recognition</h1>
          
          {!isVerifying ? (
            <div className="space-y-6">
              <p className="text-gray-600">Please complete the video verification.</p>
              <button
                onClick={handleContinue}
                className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Start Verification
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">Verification in progress...</p>
                <p className="text-sm text-gray-500 mt-2">Connecting to secure server...</p>
              </div>

              {showManualButton && (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
                  <p className="text-sm text-orange-700 mb-3">Popup didn't open?</p>
                  <button
                    onClick={() => {
                      hasStartedRef.current = false;
                      triggerQoreIDSDK();
                    }}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded flex items-center justify-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Launch Camera
                  </button>
                </div>
              )}
            </div>
          )}
          
          {error && <p className="text-red-500 mt-4 bg-red-50 p-3 rounded">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default FacialRecognition;