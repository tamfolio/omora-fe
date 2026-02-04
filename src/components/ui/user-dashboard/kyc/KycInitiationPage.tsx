import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Logo from "../../Logo";

interface KYCInitiationProps {
  onContinue: (userType: 'individual' | 'corporate') => void;
  onBack?: () => void;
}

function KYCInitiation({ onContinue, onBack }: KYCInitiationProps) {
  const [userType, setUserType] = useState<'individual' | 'corporate'>('individual');

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleContinue = () => {
    onContinue(userType);
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between w-full mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <Logo width={150} height={40} />
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Step 1/{userType === 'individual' ? '5' : '7'}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                KYC Verification
              </span>
              <div className="relative w-12 h-12">
                <svg
                  className="w-12 h-12 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeDasharray={userType === 'individual' ? '14, 100' : '10, 100'}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-cyan-600">
                    {userType === 'individual' ? '14%' : '10%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              KYC Verification
            </h1>
            <p className="text-gray-600 leading-relaxed mb-8">
              Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
              suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
              quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
              posuere vulputate arcu amet, vitae nisl, tellus tincidunt. At
              feugiat sapien varius id.
            </p>

            {/* Account Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
              <button
                type="button"
                onClick={() => setUserType('individual')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                  userType === 'individual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => setUserType('corporate')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                  userType === 'corporate'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Corporate
              </button>
            </div>

            {/* Requirements List */}
            <div className="text-left mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">You will need:</p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full flex-shrink-0"></div>
                  <span>Valid Government ID (NIN or BVN)</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full flex-shrink-0"></div>
                  <span>Contact Information & Address</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full flex-shrink-0"></div>
                  <span>Facial Recognition (Selfie)</span>
                </li>
                {userType === 'corporate' && (
                  <>
                    <li className="flex items-center space-x-3 text-gray-700">
                      <div className="w-2 h-2 bg-cyan-600 rounded-full flex-shrink-0"></div>
                      <span>Company Registration Number (RC/BN)</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-700">
                      <div className="w-2 h-2 bg-cyan-600 rounded-full flex-shrink-0"></div>
                      <span>Company Registration Documents</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
            >
              Continue as {userType === 'individual' ? 'Individual' : 'Corporate'}
            </button>

            <button
              onClick={handleGoBack}
              className="w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>

      {/* Support Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
}

export default KYCInitiation;