"use client";
import BusinessInformation from "@/components/ui/UserDashboard/kyc/BusinessInformation";
import ContactInformation from "@/components/ui/UserDashboard/kyc/ContactInformation";
import CountrySelect from "@/components/ui/UserDashboard/kyc/CountrySelect";
import FacialRecognition from "@/components/ui/UserDashboard/kyc/FacialRecognition";
import KYCInitiation from "@/components/ui/UserDashboard/kyc/KycInitiationPage";
import PersonalInformation from "@/components/ui/UserDashboard/kyc/PersonalInformation";
import DirectorInformation from "@/components/ui/UserDashboard/kyc/DirectorateInformation";
import CompanyRegDetails from "@/components/ui/UserDashboard/kyc/CompanyRegDetails";
import KycSuccessModal from "@/components/ui/UserDashboard/kyc/SuccessModal";
import KycUnsuccessfulModal from "@/components/ui/UserDashboard/kyc/UnsuccessfulModal";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getUserKycStatus, checkVerificationStatus } from "@/lib/kyc-api-service";

type VerificationType = 'individual' | 'corporate';

interface KycFormData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  bvn?: string;
  nin?: string;
  gender?: 'MALE' | 'FEMALE';
  occupation?: string;
  sourceOfFund?: string;
  verificationType?: string;
  phone?: string;
  mobileNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  businessName?: string;
  rcType?: string;
  rcNumber?: string;
  businessType?: string;
  businessAddress?: string;
  country?: string;
}

export default function KycVerification() {
  const router = useRouter();
  
  const [userType, setUserType] = useState<VerificationType>('individual');
  const [pageProgress, setPageProgress] = useState(1);
  
  // Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUnsuccessfulModal, setShowUnsuccessfulModal] = useState(false);
  
  // Data State
  const [formData, setFormData] = useState<KycFormData>({});
  const [apiNextStep, setApiNextStep] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // NEW: Track if user has verified NIN/BVN
  const [isPersonalInfoVerified, setIsPersonalInfoVerified] = useState(false);

  // --- FETCH LOGIC WITH SKIP LOGIC ---
  useEffect(() => {
    const checkKycStatus = async () => {
      try {
        const result = await getUserKycStatus();

        if (result.status === 'success' && result.data) {
          const { user, verification, onboardingState } = result.data;
          
          // Auto-populate user data
          updateFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName || undefined,
            dateOfBirth: user.dateOfBirth,
            phone: user.mobileNumber,
            mobileNumber: user.mobileNumber,
            address: user.address,
            city: user.city,
            state: user.state,
            country: user.country || undefined,
            gender: user.gender as 'MALE' | 'FEMALE' | undefined,
          });

          // Check if both NIN and BVN are verified
          const { bothVerified, ninVerified, bvnVerified } = checkVerificationStatus(verification);
          setIsPersonalInfoVerified(bothVerified);

          // Get verified NIN and BVN values
          const ninRecord = verification.find(v => v.type === 'NIN' && v.status === 'C');
          const bvnRecord = verification.find(v => v.type === 'BVN' && v.status === 'C');
          
          if (ninRecord) {
            updateFormData({ nin: ninRecord.value });
          }
          if (bvnRecord) {
            updateFormData({ bvn: bvnRecord.value });
          }

          // Handle onboarding state
          if (onboardingState) {
            setApiNextStep(onboardingState.nextStep);

            // Check if liveness verification is complete
            const livenessRecord = verification.find(v => v.type === 'LIVENESS');
            const isLivenessComplete = livenessRecord?.status === 'C';

            // Only show success modal if KYC is FULLY complete
            // currentStep should be 'dashboard' or 'verify-liveness' with status 'C'
            const isKycComplete = (onboardingState.currentStep === 'dashboard') ||
                                 (onboardingState.currentStep === 'verify-liveness' && 
                                  onboardingState.currentStepStatus === 'C' &&
                                  isLivenessComplete);

            if (isKycComplete && onboardingState.currentStepStatus === 'C') {
              setShowSuccessModal(true);
            } else if (onboardingState.currentStepStatus === 'NVP') {
              setShowUnsuccessfulModal(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to check KYC status', error);
      } finally {
        setLoading(false);
      }
    };

    checkKycStatus();
  }, []);

  // --- RETRY LOGIC ---
  const handleRetry = () => {
    setShowUnsuccessfulModal(false);
    
    if (apiNextStep) {
      const stepNumber = getStepNumberFromApiStatus(apiNextStep);
      setPageProgress(stepNumber);
    } else {
      setPageProgress(1);
    }
  };

  // Helper to map API strings to Component Steps (UPDATED - no document upload)
  const getStepNumberFromApiStatus = (apiStep: string): number => {
    switch (apiStep) {
      case 'initiation': return 1;
      case 'verify-country': return 2;
      case 'verify-bvn':
      case 'verify-nin':
      case 'personal-info': 
        // If already verified, skip to contact info
        return isPersonalInfoVerified ? 4 : 3;
      case 'contact-info': return 4;
      case 'facial-recognition':
      case 'verify-liveness': return 5;  // Changed from 6 to 5 (no document upload)
      case 'dashboard': 
        router.push('/dashboard');
        return 1;
      default: return 1;
    }
  };

  const toggleUserType = () => {
    setUserType((prev) => (prev === 'individual' ? 'corporate' : 'individual'));
    setFormData({});
    setPageProgress(1);
  };

  // UPDATED: Total steps reduced from 6 to 5 (removed document upload)
  const getTotalSteps = () => {
    return userType === 'individual' ? 5 : 5;
  };

  const nextStep = () => {
    const totalSteps = getTotalSteps();
    
    // NEW: Skip personal info step if already verified
    if (pageProgress === 2 && isPersonalInfoVerified && userType === 'individual') {
      setPageProgress(4); // Skip to contact info
      return;
    }
    
    if (pageProgress === totalSteps) {
      setShowSuccessModal(true);
    } else {
      setPageProgress((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (pageProgress === 1) {
      router.push('/dashboard');
    } else if (pageProgress === 4 && isPersonalInfoVerified && userType === 'individual') {
      // If going back from contact info and personal info was skipped, go to country select
      setPageProgress(2);
    } else {
      setPageProgress((prev) => prev - 1);
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleBackFromInitiation = () => {
    router.push('/dashboard');
  };

  const updateFormData = (data: Partial<KycFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handlePersonalInfoNext = (data?: any) => {
    if (data) {
      updateFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        dateOfBirth: data.dateOfBirth,
        verificationType: data.verificationType,
        bvn: data.bvn,
        nin: data.nin,
        gender: data.gender,
        occupation: data.occupation,
        sourceOfFund: data.sourceOfFund,
      });
      
      // Mark as verified when user completes this step
      setIsPersonalInfoVerified(true);
    }
    nextStep();
  };

  const handleContactInfoNext = (data?: any) => {
    if (data) {
      const phoneValue = data.mobileNumber || data.phone || '';
      
      updateFormData({
        mobileNumber: phoneValue,
        phone: phoneValue,
        address: data.address,
        city: data.city,
        state: data.state,
      });
    }
    nextStep();
  };

  const handleBusinessInfoNext = (data?: any) => {
    if (data) {
      updateFormData({
        businessName: data.businessName,
        rcType: data.rcType,
        rcNumber: data.rcNumber,
        businessType: data.businessType,
        businessAddress: data.businessAddress,
      });
    }
    nextStep();
  };

  const handleCountryNext = (country?: string) => {
    if (country) {
      updateFormData({ country });
    }
    nextStep();
  };

  // UPDATED: Removed DocumentUpload step (case 5), FacialRecognition now at case 5
  const renderCurrentStep = () => {
    switch (pageProgress) {
      case 1:
        return <KYCInitiation onContinue={nextStep} onBack={handleBackFromInitiation} />;
      
      case 2:
        return <CountrySelect onNext={handleCountryNext} onBack={prevStep} />;
      
      case 3:
        if (userType === 'individual') {
          return (
            <PersonalInformation
              onNext={handlePersonalInfoNext}
              onBack={prevStep}
              initialData={formData}
            />
          );
        } else {
          return <BusinessInformation onNext={handleBusinessInfoNext} onBack={prevStep} />;
        }
      
      case 4:
        if (userType === 'individual') {
          return <ContactInformation onBack={prevStep} onNext={handleContactInfoNext} />;
        } else {
          return <DirectorInformation onNext={nextStep} onBack={prevStep} />;
        }
      
      case 5:
        // UPDATED: FacialRecognition moved from case 6 to case 5
        if (userType === 'individual') {
          return (
            <FacialRecognition 
              onBack={prevStep} 
              onNext={nextStep}
              firstName={formData.firstName}
              lastName={formData.lastName}
              nin={formData.nin}
              bvn={formData.bvn}
              dateOfBirth={formData.dateOfBirth}
              gender={formData.gender}
              phone={formData.phone}
            />
          );
        } else {
          return <CompanyRegDetails onNext={nextStep} onBack={prevStep} />;
        }
      
      default:
        return <KYCInitiation onContinue={nextStep} onBack={handleBackFromInitiation} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading verification status...
      </div>
    );
  }

  return (
    <div className="kyc-verification">
      <div className="step-content">
        {renderCurrentStep()}
      </div>
      
      {showSuccessModal && (
        <KycSuccessModal onGoToDashboard={handleGoToDashboard} />
      )}
      
      {showUnsuccessfulModal && (
        <KycUnsuccessfulModal 
          onRetry={handleRetry}
          onContactSupport={() => router.push('/support')}
          message={apiNextStep ? `Verification stopped at ${apiNextStep}. Please retry.` : undefined}
        />
      )}
    </div>
  );
}