import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '../../Logo';
import kycApiService from '@/lib/kyc-api-service';

interface FacialRecognitionProps {
  onNext: () => void;
  onBack: () => void;
  firstName?: string;
  lastName?: string;
  nin?: string;
  bvn?: string;
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
  bvn,
  dateOfBirth, 
  gender,
  phone
}: FacialRecognitionProps) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [showManualButton, setShowManualButton] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerReference, setCustomerReference] = useState<string>('');
  const [verificationComplete, setVerificationComplete] = useState(false);
  
  const hasStartedRef = useRef(false);

  // Load QoreID SDK
  useEffect(() => {
    if (document.querySelector('script[src*="qoreid.js"]')) return;

    const script = document.createElement('script');
    script.src = 'https://dashboard.qoreid.com/qoreid-sdk/qoreid.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const triggerQoreIDSDK = () => {
    if (hasStartedRef.current) return;
    
    hasStartedRef.current = true;

    try {
      const button = document.getElementById('QoreIDButton');
      if (button) {
        const newButton = button.cloneNode(true) as HTMLElement;
        button.parentNode?.replaceChild(newButton, button);

        // ✅ Success - proceed to next step
        newButton.addEventListener('qoreid:verificationSubmitted', (() => {
          console.log('QoreID verification submitted - proceeding to next step');
          setVerificationComplete(true);
          
          setTimeout(() => {
            onNext();
          }, 1500);
        }) as EventListener);

        // ✅ Error - redirect to dashboard
        newButton.addEventListener('qoreid:verificationError', ((event: any) => {
          console.log('QoreID verification error:', event.detail);
          setIsVerifying(false);
          setError('Verification process failed. Redirecting...');
          hasStartedRef.current = false;
          
          setTimeout(() => {
            console.log('Redirecting to dashboard with kyc=failed');
            router.push('/dashboard?kyc=failed');
          }, 2000);
        }) as EventListener);

        // ✅ FIXED: Closed - user cancelled, redirect to dashboard
        newButton.addEventListener('qoreid:verificationClosed', () => {
          console.log('QoreID verification closed by user - redirecting to dashboard');
          setIsVerifying(false);
          setShowManualButton(false);
          hasStartedRef.current = false;
          
          // User cancelled - redirect to dashboard with pending status
          setTimeout(() => {
            router.push('/dashboard?kyc=pending');
          }, 1000);
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
      console.error('Error triggering QoreID SDK:', err);
      setShowManualButton(true);
      hasStartedRef.current = false;
    }
  };

  const handleContinue = async () => {
    if (!nin) return setError('NIN required');
    if (!bvn) return setError('BVN required');
    
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
      // Format dateOfBirth from dd/mm/yyyy to dd/mm/yyyy (ensure clean format)
      let formattedDob = dateOfBirth || '';
      if (formattedDob && formattedDob.includes('/')) {
        const parts = formattedDob.split('/');
        if (parts.length === 3) {
          formattedDob = `${parts[0]}/${parts[1]}/${parts[2]}`;
        }
      }

      const verificationData = {
        dob: formattedDob,
        gender: (gender || 'MALE') as 'MALE' | 'FEMALE',
        idNumber: bvn || '',
        employmentStatus: 'Employed',
        pep: 'salary'
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
          ) : verificationComplete ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">Verification Complete!</p>
                <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">Verification in progress...</p>
                <p className="text-sm text-gray-500 mt-2">Please complete the liveness check...</p>
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