"use client";

import BusinessInformation from "@/components/ui/UserDashboard/Kyc/Businessinformation";
import ContactInformation from "@/components/ui/UserDashboard/Kyc/Contactinformation";
import CountrySelect from "@/components/ui/UserDashboard/Kyc/CountrySelect";
import DocumentUpload from "@/components/ui/UserDashboard/Kyc/DocumentUpload";
import FacialRecognition from "@/components/ui/UserDashboard/Kyc/FacialRecognition";
import KYCInitiation from "@/components/ui/UserDashboard/Kyc/KycInitiationPage";
import PersonalInformation from "@/components/ui/UserDashboard/Kyc/PersonalInformation";
import DirectorateInformation from "@/components/ui/UserDashboard/Kyc/DirectorateInformation";
import CompanyRegDetails from "@/components/ui/UserDashboard/Kyc/CompanyRegDetails";
import KycSuccessModal from "@/components/ui/UserDashboard/Kyc/SuccessModal";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type VerificationType = 'individual' | 'corporate';

export default function KycVerification() {
  const router = useRouter();
  
  // State for user type - starts with 'corporate' for testing
  const [userType, setUserType] = useState<VerificationType>('corporate');
  
  // Page progress state - starts at 1 for KYC Initiation
  const [pageProgress, setPageProgress] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Toggle function for testing both flows (remove this in production)
  const toggleUserType = () => {
    setUserType(prev => prev === 'individual' ? 'corporate' : 'individual');
  };

  // Get the total number of steps based on user type
  const getTotalSteps = () => {
    return userType === 'individual' ? 6 : 6; // Both have 6 steps, just different components
  };

  // Function to go to next step
  const nextStep = () => {
    const totalSteps = getTotalSteps();
    if (pageProgress === totalSteps) {
      // If we're on the last step, show success modal
      setShowSuccessModal(true);
    } else {
      setPageProgress((prev) => prev + 1);
    }
  };

  // Function to go to previous step
  const prevStep = () => {
    if (pageProgress === 1) {
      // If on first step, go back to dashboard
      router.push('/dashboard');
    } else {
      setPageProgress((prev) => prev - 1);
    }
  };

  // Function to handle navigation to dashboard
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  // Function to handle back navigation from first step
  const handleBackFromInitiation = () => {
    router.push('/dashboard');
  };

  // Render different components based on current step and user type
  const renderCurrentStep = () => {
    switch (pageProgress) {
      case 1:
        return <KYCInitiation onContinue={nextStep} onBack={handleBackFromInitiation} />;
      
      case 2:
        return <CountrySelect onNext={nextStep} onBack={prevStep} />;
      
      case 3:
        if (userType === 'individual') {
          return <PersonalInformation onNext={nextStep} onBack={prevStep} />;
        } else {
          return <BusinessInformation onNext={nextStep} onBack={prevStep} />;
        }
      
      case 4:
        if (userType === 'individual') {
          return <ContactInformation onBack={prevStep} onNext={nextStep} />;
        } else {
          return <DirectorInformation onNext={nextStep} onBack={prevStep} />;
        }
      
      case 5:
        if (userType === 'individual') {
          return <DocumentUpload onBack={prevStep} onNext={nextStep} />;
        } else {
          return <CompanyRegDetails onNext={nextStep} onBack={prevStep} />;
        }
      
      case 6:
        if (userType === 'individual') {
          return <FacialRecognition onBack={prevStep} onNext={nextStep} />;
        } else {
          // For corporate, step 6 shows success modal instead of facial recognition
          setShowSuccessModal(true);
          return null;
        }
      
      default:
        return <KYCInitiation onContinue={nextStep} onBack={handleBackFromInitiation} />;
    }
  };

  return (
    <div className="kyc-verification">
      {/* Temporary toggle for testing - remove in production */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={toggleUserType}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Testing: {userType} 
          <br />
          <span className="text-xs">Click to switch</span>
        </button>
      </div>

      {/* Current step component */}
      <div className="step-content">{renderCurrentStep()}</div>

      {/* Success Modal - shows after completing all steps */}
      {showSuccessModal && (
        <KycSuccessModal onGoToDashboard={handleGoToDashboard} />
      )}
    </div>
  );
}