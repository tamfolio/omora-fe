"use client";
import ContactInformation from "@/components/ui/UserDashboard/Kyc/ContactInformation";
import CountrySelect from "@/components/ui/UserDashboard/Kyc/CountrySelect";
import DocumentUpload from "@/components/ui/UserDashboard/Kyc/DocumentUpload";
import FacialRecognition from "@/components/ui/UserDashboard/Kyc/FacialRecognistion";
import PersonalInformation from "@/components/ui/UserDashboard/Kyc/PersonalInformation";
import KycSuccessModal from "@/components/ui/UserDashboard/Kyc/SuccessModal";
import VerificationType from "@/components/ui/UserDashboard/Kyc/VerificationType";

import { useRouter } from "next/navigation"; // Add this import
import React, { useState } from "react";

function KycVerification() {
  const router = useRouter(); // Add router hook
  
  // Page progress state - tracks which step the user is on
  const [pageProgress, setPageProgress] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Add success modal state

  // Function to go to next step
  const nextStep = () => {
    if (pageProgress === 6) {
      // If we're on the last step (Facial Recognition), show success modal
      setShowSuccessModal(true);
    } else {
      setPageProgress((prev) => prev + 1);
    }
  };

  // Function to go to previous step
  const prevStep = () => {
    setPageProgress((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Function to go to specific step
  const goToStep = (step: number) => { // Add TypeScript typing
    setPageProgress(step);
  };

  // Function to handle navigation to dashboard
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  // Render different components based on current step
  const renderCurrentStep = () => {
    switch (pageProgress) {
      case 1:
        return <CountrySelect onNext={nextStep} />;
      case 2:
        return <VerificationType onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <PersonalInformation onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <ContactInformation onBack={prevStep} onNext={nextStep} />;
      case 5:
        return <DocumentUpload onBack={prevStep} onNext={nextStep} />;
      case 6:
        return <FacialRecognition onBack={prevStep} onNext={nextStep} />;
      default:
        return <CountrySelect onNext={nextStep} />;
    }
  };

  return (
    <div className="kyc-verification">
      {/* Current step component */}
      <div className="step-content">{renderCurrentStep()}</div>

      {/* Success Modal - shows after completing all steps */}
      {showSuccessModal && (
        <KycSuccessModal onGoToDashboard={handleGoToDashboard} />
      )}

      {/* Debug info (remove in production) */}
    </div>
  );
}

export default KycVerification;