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
    console.log('🔍 [PAGE] ====== CHECKING KYC STATUS ======');
    console.log('🔍 [PAGE] Timestamp:', new Date().toISOString());
    
    try {
      const result = await getUserKycStatus();

      if (result.status === "success" && result.data) {
        const { user, verification, onboardingState, business } = result.data;

        console.log('📦 [PAGE] Onboarding state:', {
          currentStep: onboardingState?.currentStep,
          currentStepStatus: onboardingState?.currentStepStatus,
          nextStep: onboardingState?.nextStep,
          progress: onboardingState?.progress,
        });

        console.log('🏢 [PAGE] Business:', {
          hasBusinessId: !!business?.businessId,
          businessName: business?.businessName,
        });

        // Populate form data
        updateFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName || undefined,
          dateOfBirth: user.dateOfBirth
            ? new Date(user.dateOfBirth).toLocaleDateString("en-GB")
            : undefined,
          phone: user.mobileNumber,
          mobileNumber: user.mobileNumber,
          address: user.address,
          city: user.city,
          state: user.state,
          country: user.country || undefined,
          gender: user.gender as "MALE" | "FEMALE" | undefined,
        });

        // Handle verification
        if (verification) {
          const { bothVerified } = checkVerificationStatus(verification);
          setIsPersonalInfoVerified(bothVerified);

          const ninRecord = verification.find(
            (v) => v.type === "NIN" && v.status === "C",
          );
          const bvnRecord = verification.find(
            (v) => v.type === "BVN" && v.status === "C",
          );
          if (ninRecord) updateFormData({ nin: ninRecord.value });
          if (bvnRecord) updateFormData({ bvn: bvnRecord.value });
        }

        // Handle onboarding state
        if (onboardingState) {
          const currentStep = onboardingState.currentStep;
          const currentStepStatus = onboardingState.currentStepStatus;
          const apiNextStep = onboardingState.nextStep;

          const stepToAnalyze = currentStepStatus === 'C' ? apiNextStep : currentStep;
          const targetStep = getStepNumberFromApiStatus(stepToAnalyze);
          const apiNextStepNumber = getStepNumberFromApiStatus(apiNextStep);
          
          const isCorporate = business?.businessId || targetStep >= 6 || apiNextStepNumber >= 6;

          // ✅ Set userType based on detection
          if (isCorporate) {
            console.log('✅ [PAGE] Detected CORPORATE user');
            setUserType("corporate");
          } else {
            console.log('👤 [PAGE] Detected INDIVIDUAL user');
            setUserType("individual");
          }

          console.log('📈 [PAGE] Setting page to step:', targetStep);

          // Check completion
          const isKycComplete = currentStepStatus === "C" && apiNextStep === "dashboard";

          if (isKycComplete) {
            console.log('🎉 [PAGE] KYC Complete');
            setShowSuccessModal(true);
          } else if (currentStepStatus === "NVP") {
            console.log('❌ [PAGE] KYC Failed');
            setShowUnsuccessfulModal(true);
          } else {
            // ✅ Set pageProgress AFTER userType is determined
            setTimeout(() => {
              console.log('📈 [PAGE] Setting page progress to:', targetStep);
              setPageProgress(targetStep);
            }, 0);
          }
        }
      }
    } catch (error) {
      console.error("❌ [PAGE] Failed to check KYC status", error);
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
      setPageProgress(stepNumber);
    } else {
      setPageProgress(1);
    }
  };

  const getStepNumberFromApiStatus = (apiStep: string): number => {
    console.log("🔢 [PAGE] getStepNumberFromApiStatus:", apiStep);

    switch (apiStep) {
      case "initiation":
        return 1;
      case "verify-country":
        return 2;
      case "verify-bvn":
      case "verify-nin":
      case "personal-info":
        return 3;
      case "contact-info":
        return 4;
      case "facial-recognition":
      case "verify-liveness":
        return 5;
      case "upload-business-details":
      case "update-business-details":
      case "business-information":
      case "business-info":
        console.log("✅ [PAGE] Detected BUSINESS step (step 6)");
        return 6;
      case "upload-business-docs":
      case "update-business-docs":
      case "company-documents":
        return 7;
      case "dashboard":
        console.log("🏁 [PAGE] Detected DASHBOARD step");
        return 8;
      default:
        console.warn(
          `⚠️ [PAGE] Unknown API step: ${apiStep}, defaulting to step 1`,
        );
        return 1;
    }
  };

  const getTotalSteps = () => {
    return userType === "individual" ? 5 : 7;
  };

  const nextStep = () => {
  const totalSteps = getTotalSteps();

  console.log("➡️ [PAGE] ====== NEXT STEP CALLED ======");
  console.log("➡️ [PAGE] Timestamp:", new Date().toISOString());
  console.log("➡️ [PAGE] Current state:", {
    currentStep: pageProgress,
    totalSteps,
    userType,
  });

  if (pageProgress === totalSteps) {
    console.log("🎉 [PAGE] Reached final step, showing success modal");
    setShowSuccessModal(true);
  } else {
    const newStep = pageProgress + 1;
    console.log(`📈 [PAGE] Moving from step ${pageProgress} to step ${newStep}`);
    setPageProgress(newStep);
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
    console.log("💼 [PAGE] Business info submitted:", data);
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
  console.log("🎬 [PAGE] renderCurrentStep() called:", {
    pageProgress,
    userType,
    totalSteps: getTotalSteps(),
  });
    // Step 2: Country Select
  if (pageProgress === 2) {
    console.log("🌍 [PAGE] Rendering CountrySelect component");
    return (
      <CountrySelect
        onNext={handleCountryNext}
        onBack={prevStep}
      />
    );
  }

  // Step 3: Personal Information
  if (pageProgress === 3) {
    console.log("👤 [PAGE] Rendering PersonalInformation component");
    return (
      <PersonalInformation
        onNext={handlePersonalInfoNext}
        onBack={prevStep}
      />
    );
  }

  // Step 4: Contact Information
  if (pageProgress === 4) {
    console.log("📞 [PAGE] Rendering ContactInformation component");
    return (
      <ContactInformation
        onNext={handleContactInfoNext}
        onBack={prevStep}
      />
    );
  }

  // Step 5: Facial Recognition
  if (pageProgress === 5) {
    console.log("📸 [PAGE] Rendering FacialRecognition component");
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
    if (pageProgress === 6 && userType === "corporate") {
      console.log("🏢 [PAGE] Rendering BusinessInformation component");
      return (
        <BusinessInformation
          onNext={handleBusinessInfoNext}
          onBack={prevStep}
        />
      );
    }

    if (pageProgress === 7 && userType === "corporate") {
      return <CompanyRegDetails onNext={nextStep} onBack={prevStep} />;
    }

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
