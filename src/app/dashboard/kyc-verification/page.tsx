"use client";
import BusinessInformation from "@/components/ui/user-dashboard/kyc/BusinessInformation";
import ContactInformation from "@/components/ui/user-dashboard/kyc/ContactInformation";
import CountrySelect from "@/components/ui/user-dashboard/kyc/CountrySelect";
import FacialRecognition from "@/components/ui/user-dashboard/kyc/FacialRecognition";
import KYCInitiation from "@/components/ui/user-dashboard/kyc/KycInitiationPage";
import PersonalInformation from "@/components/ui/user-dashboard/kyc/PersonalInformation";
import CompanyRegDetails from "@/components/ui/user-dashboard/kyc/CompanyRegDetails";
import KycSuccessModal from "@/components/ui/user-dashboard/kyc/SuccessModal";
import KycUnsuccessfulModal from "@/components/ui/user-dashboard/kyc/UnsuccessfulModal";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  getUserKycStatus,
  checkVerificationStatus,
} from "@/lib/kyc-api-service";

type VerificationType = "individual" | "corporate";

interface KycFormData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  bvn?: string;
  nin?: string;
  gender?: "MALE" | "FEMALE";
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

  const [userType, setUserType] = useState<VerificationType>("individual");
  const [pageProgress, setPageProgress] = useState(1);

  // Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUnsuccessfulModal, setShowUnsuccessfulModal] = useState(false);

  // Data State
  const [formData, setFormData] = useState<KycFormData>({});
  const [apiNextStep, setApiNextStep] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Track if user has verified NIN/BVN
  const [isPersonalInfoVerified, setIsPersonalInfoVerified] = useState(false);

 useEffect(() => {
  const checkKycStatus = async () => {
    try {
      const result = await getUserKycStatus();

      if (result.status === 'success' && result.data) {
        const { user, verification, onboardingState, business } = result.data;

        // 1. Populate User Data (Standard Stuff)
        updateFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName || undefined,
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-GB') : undefined,
          phone: user.mobileNumber,
          mobileNumber: user.mobileNumber,
          address: user.address,
          city: user.city,
          state: user.state,
          country: user.country || undefined,
          gender: user.gender as 'MALE' | 'FEMALE' | undefined,
        });

        // 2. Handle Verification Status (Checkmarks)
        if (verification) {
          const { bothVerified } = checkVerificationStatus(verification);
          setIsPersonalInfoVerified(bothVerified);
          
          const ninRecord = verification.find(v => v.type === 'NIN' && v.status === 'C');
          const bvnRecord = verification.find(v => v.type === 'BVN' && v.status === 'C');
          if (ninRecord) updateFormData({ nin: ninRecord.value });
          if (bvnRecord) updateFormData({ bvn: bvnRecord.value });
        }

        // 3. THE NAVIGATION LOGIC
        if (onboardingState) {
          const next = onboardingState.nextStep; // e.g., "upload-business-docs"
          setApiNextStep(next);

          // Calculate which page number this is
          const targetStep = getStepNumberFromApiStatus(next);

          // CRITICAL: If the target is Step 6 or 7, FORCE Corporate Mode.
          // This ensures the renderCurrentStep function doesn't hide the component.
          if (targetStep >= 6 || business?.businessId) {
             setUserType('corporate');
          }

          // 4. Success/Failure Checks
          const livenessRecord = verification?.find(v => v.type === 'LIVENESS');
          const isLivenessComplete = livenessRecord?.status === 'C';
          
          // If we are at dashboard step or fully complete
          if (onboardingState.currentStep === 'dashboard') {
             setShowSuccessModal(true);
          } 
          // If Liveness failed specifically
          else if (onboardingState.currentStep === 'verify-liveness' && onboardingState.currentStepStatus === 'NVP') {
             setShowUnsuccessfulModal(true);
          } 
          // Otherwise, Go to the "nextStep"
          else {
             setPageProgress(targetStep);
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

  const handleRetry = () => {
    setShowUnsuccessfulModal(false);

    if (apiNextStep) {
      const stepNumber = getStepNumberFromApiStatus(apiNextStep);
      console.log("🔍 Setting step:", stepNumber, "userType:", userType);
      setPageProgress(stepNumber);
    } else {
      setPageProgress(1);
    }
  };
  const getStepNumberFromApiStatus = (apiStep: string): number => {
    switch (apiStep) {
      case "initiation":
        return 1; // Initiation Page

      case "verify-country":
        return 2; // Country Select

      case "verify-bvn":
      case "verify-nin":
      case "personal-info":
        // If personal info is verified, we might skip to 4, but let's be safe and go to 3
        return 3;

      case "contact-info":
        return 4; // Contact Information

      case "facial-recognition":
      case "verify-liveness":
        return 5; // Facial Recognition

      // --- CORPORATE STEPS ---
      // If nextStep is "upload-business-details", go to Step 6
      case "upload-business-details":
      case "business-information": // handling potential alias
      case "business-info": // handling potential alias
        return 6;

      // If nextStep is "upload-business-docs", go to Step 7
      case "upload-business-docs":
      case "company-documents": // handling potential alias
        return 7;

      case "dashboard":
        router.push("/dashboard");
        return 1;

      default:
        console.warn(`Unknown API step: ${apiStep}, defaulting to step 1`);
        return 1;
    }
  };

  const getTotalSteps = () => {
    // Individual: 5 steps (Initiation → Country → Personal → Contact → Liveness)
    // Corporate: 7 steps (Initiation → Country → Personal → Contact → Liveness → Business → Documents)
    return userType === "individual" ? 5 : 7;
  };

  const nextStep = () => {
    const totalSteps = getTotalSteps();

    // Skip Personal Info if already verified (Individual only)
    if (
      pageProgress === 2 &&
      isPersonalInfoVerified &&
      userType === "individual"
    ) {
      setPageProgress(4);
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
      router.push("/dashboard");
    } else if (
      pageProgress === 4 &&
      isPersonalInfoVerified &&
      userType === "individual"
    ) {
      setPageProgress(2);
    } else {
      setPageProgress((prev) => prev - 1);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleBackFromInitiation = () => {
    router.push("/dashboard");
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

      setIsPersonalInfoVerified(true);
    }
    nextStep();
  };

  const handleContactInfoNext = (data?: any) => {
    if (data) {
      const phoneValue = data.mobileNumber || data.phone || "";

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

  const renderCurrentStep = () => {
    // Step 1: KYC Initiation (Both)
    if (pageProgress === 1) {
      return (
        <KYCInitiation
          onContinue={(selectedType: VerificationType) => {
            setUserType(selectedType);
            nextStep();
          }}
          onBack={handleBackFromInitiation}
        />
      );
    }

    // Step 2: Country Select (Both)
    if (pageProgress === 2) {
      return <CountrySelect onNext={handleCountryNext} onBack={prevStep} />;
    }

    // Step 3: Personal Information (Both)
    if (pageProgress === 3) {
      return (
        <PersonalInformation
          onNext={handlePersonalInfoNext}
          onBack={prevStep}
          initialData={formData}
        />
      );
    }

    // Step 4: Contact Information (Both Individual and Corporate)
    if (pageProgress === 4) {
      return (
        <ContactInformation onBack={prevStep} onNext={handleContactInfoNext} />
      );
    }

    // Step 5: Facial Recognition / Liveness (Both)
    if (pageProgress === 5) {
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
    }

    // Step 6: Business Information (Corporate Only)
    if (pageProgress === 6 && userType === "corporate") {
      return (
        <BusinessInformation
          onNext={handleBusinessInfoNext}
          onBack={prevStep}
        />
      );
    }

    // Step 7: Company Registration Documents (Corporate Only)
    if (pageProgress === 7 && userType === "corporate") {
      return <CompanyRegDetails onNext={nextStep} onBack={prevStep} />;
    }

    // Default fallback
    return (
      <KYCInitiation
        onContinue={(selectedType: VerificationType) => {
          setUserType(selectedType);
          nextStep();
        }}
        onBack={handleBackFromInitiation}
      />
    );
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
      <div className="step-content">{renderCurrentStep()}</div>

      {showSuccessModal && (
        <KycSuccessModal onGoToDashboard={handleGoToDashboard} />
      )}

      {showUnsuccessfulModal && (
        <KycUnsuccessfulModal
          onRetry={handleRetry}
          onContactSupport={() => router.push("/support")}
          message={
            apiNextStep
              ? `Verification stopped at ${apiNextStep}. Please retry.`
              : undefined
          }
        />
      )}
    </div>
  );
}
