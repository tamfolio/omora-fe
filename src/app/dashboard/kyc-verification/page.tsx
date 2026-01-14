"use client";
import BusinessInformation from "@/components/ui/UserDashboard/kyc/BusinessInformation";
import ContactInformation from "@/components/ui/UserDashboard/kyc/ContactInformation";
import CountrySelect from "@/components/ui/UserDashboard/kyc/CountrySelect";
import DocumentUpload from "@/components/ui/UserDashboard/kyc/DocumentUpload";
import FacialRecognition from "@/components/ui/UserDashboard/kyc/FacialRecognition";
import KYCInitiation from "@/components/ui/UserDashboard/kyc/KycInitiationPage";
import PersonalInformation from "@/components/ui/UserDashboard/kyc/PersonalInformation";
import DirectorInformation from "@/components/ui/UserDashboard/kyc/DirectorateInformation";
import CompanyRegDetails from "@/components/ui/UserDashboard/kyc/CompanyRegDetails";
import KycSuccessModal from "@/components/ui/UserDashboard/kyc/SuccessModal";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<KycFormData>({});

  const toggleUserType = () => {
    setUserType(prev => prev === 'individual' ? 'corporate' : 'individual');
    setFormData({});
    setPageProgress(1);
  };

  const getTotalSteps = () => {
    return userType === 'individual' ? 6 : 6;
  };

  const nextStep = () => {
    const totalSteps = getTotalSteps();
    if (pageProgress === totalSteps) {
      setShowSuccessModal(true);
    } else {
      setPageProgress((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (pageProgress === 1) {
      router.push('/dashboard');
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
    setFormData(prev => ({ ...prev, ...data }));
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
        sourceOfFund: data.sourceOfFund
      });
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
        state: data.state
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
        businessAddress: data.businessAddress
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
    switch (pageProgress) {
      case 1:
        return <KYCInitiation onContinue={nextStep} onBack={handleBackFromInitiation} />;
      
      case 2:
        return <CountrySelect onNext={handleCountryNext} onBack={prevStep} />;
      
      case 3:
        if (userType === 'individual') {
          return <PersonalInformation onNext={handlePersonalInfoNext} onBack={prevStep} />;
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
        if (userType === 'individual') {
          return <DocumentUpload onBack={prevStep} onNext={nextStep} />;
        } else {
          return <CompanyRegDetails onNext={nextStep} onBack={prevStep} />;
        }
      
      case 6:
        if (userType === 'individual') {
          return (
            <FacialRecognition 
              onBack={prevStep} 
              onNext={nextStep}
              firstName={formData.firstName}
              lastName={formData.lastName}
              nin={formData.nin}
              dateOfBirth={formData.dateOfBirth}
              gender={formData.gender}
              phone={formData.phone}
            />
          );
        }
      
      default:
        return <KYCInitiation onContinue={nextStep} onBack={handleBackFromInitiation} />;
    }
  };

  return (
    <div className="kyc-verification">
      {/* Debug toggle - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50">
          <button 
            onClick={toggleUserType}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 text-xs"
          >
            {userType}
          </button>
        </div>
      )}

      <div className="step-content">{renderCurrentStep()}</div>

      {showSuccessModal && (
        <KycSuccessModal onGoToDashboard={handleGoToDashboard} />
      )}
    </div>
  );
}