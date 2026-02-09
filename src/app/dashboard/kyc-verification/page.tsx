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

        if (result.status === "success" && result.data) {
          const { user, verification, onboardingState, business } = result.data;

          // 1. Populate User Data
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

          // 2. Handle Verification Status
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

          // 3. Navigation Logic
          if (onboardingState) {
            const currentStep = onboardingState.currentStep;
            const currentStepStatus = onboardingState.currentStepStatus;
            const nextStep = onboardingState.nextStep;

            setApiNextStep(currentStep);

            const targetStep = getStepNumberFromApiStatus(currentStep);

            //  Detect corporate by checking business object OR next step
            const nextStepNumber = getStepNumberFromApiStatus(nextStep);
            const isCorporate =
              business?.businessId || targetStep >= 6 || nextStepNumber >= 6;

            if (isCorporate) {
              setUserType("corporate");
            }

            // 4. SUCCESS/FAILURE LOGIC
            const isKycComplete =
              currentStepStatus === "C" && nextStep === "dashboard";

            if (isKycComplete) {
              setShowSuccessModal(true);
            } else if (currentStepStatus === "NVP") {
              setShowUnsuccessfulModal(true);
            } else {
              // If current step is complete ('C'), go to nextStep instead
              const stepToShow =
                currentStepStatus === "C" ? nextStepNumber : targetStep;
              setPageProgress(stepToShow);
            }
          }
        }
      } catch (error) {
        console.error("Failed to check KYC status", error);
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
        return 6;

      case "upload-business-docs":
      case "update-business-docs":
      case "company-documents":
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
    return userType === "individual" ? 5 : 7;
  };

  const nextStep = () => {
    const totalSteps = getTotalSteps();

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

    if (pageProgress === 2) {
      return <CountrySelect onNext={handleCountryNext} onBack={prevStep} />;
    }

    if (pageProgress === 3) {
      return (
        <PersonalInformation
          onNext={handlePersonalInfoNext}
          onBack={prevStep}
          initialData={formData}
        />
      );
    }

    if (pageProgress === 4) {
      return (
        <ContactInformation onBack={prevStep} onNext={handleContactInfoNext} />
      );
    }

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

    if (pageProgress === 6 && userType === "corporate") {
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
