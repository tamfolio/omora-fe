import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Logo from "../../Logo";

interface KYCInitiationProps {
  onContinue: (userType: 'individual' | 'corporate') => void;
  onBack?: () => void;
  // ✅ ADDED: Allows parent to set the active tab initially
  defaultType?: 'individual' | 'corporate';
}

function KYCInitiation({ onContinue, onBack, defaultType = 'individual' }: KYCInitiationProps) {
  // Initialize state with the passed defaultType
  const [userType, setUserType] = useState<'individual' | 'corporate'>(defaultType);

  const handleContinue = () => {
    onContinue(userType);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Back</span>
            </button>
            <Logo width={120} />
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                 Step 1/{userType === 'individual' ? '5' : '7'}
               </p>
               <p className="text-xs font-semibold text-gray-900">KYC Verification</p>
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center">
              <svg className="absolute w-full h-full -rotate-90 text-teal-500" viewBox="0 0 36 36">
                 <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="currentColor" strokeWidth="3" 
                    strokeDasharray={userType === 'individual' ? '14, 100' : '10, 100'} 
                 />
              </svg>
              <span className="text-[10px] font-bold text-gray-700">
                {userType === 'individual' ? '14%' : '10%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Account Type Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setUserType('individual')}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                userType === 'individual'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setUserType('corporate')}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                userType === 'corporate'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Corporate
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              KYC Verification
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Please have the following ready:
            </p>

            {/* Dynamic Requirements List based on User Type */}
            <div className="text-left space-y-4">
              {userType === 'individual' ? (
                // ✅ INDIVIDUAL REQUIREMENTS (from image_8bee64.png)
                <ol className="list-decimal list-outside ml-4 space-y-3 text-sm text-gray-600 leading-relaxed">
                  <li className="pl-2">
                    <span className="font-medium text-gray-800">Valid ID</span> (NIN, International Passport, Voter&apos;s Card or Driver&apos;s License)
                  </li>
                  <li className="pl-2">
                    <span className="font-medium text-gray-800">BVN</span> (Only your name, phone number, and date of birth are retrieved; never your bank balance or transactions)
                  </li>
                  <li className="pl-2">
                    <span className="font-medium text-gray-800">Proof of Address</span> <span className="text-gray-400 italic">(Optional)</span> e.g. Recent Utility bill, Bank statement, or any official document with your residential address
                  </li>
                  <li className="pl-2">
                    <span className="font-medium text-gray-800">Liveness Check</span> (A well-lit environment for a quick face scan)
                  </li>
                </ol>
              ) : (
                // ✅ CORPORATE REQUIREMENTS (from image_8bdfb9.jpg)
                <ol className="list-decimal list-outside ml-4 space-y-3 text-sm text-gray-600 leading-relaxed">
                  <li className="pl-2">
                    Certificate of Incorporation (CAC)
                  </li>
                  <li className="pl-2">
                    CAC Form 2 & 7/Status Extract
                  </li>
                  <li className="pl-2">
                    Board Resolution or Authorization Letter
                  </li>
                  <li className="pl-2">
                    Valid Government-Issued ID of Director (NIN, International Passport, Voter&apos;s Card or Driver&apos;s License)
                  </li>
                  <li className="pl-2">
                    Proof of Address (Business Utility Bill shouldn&apos;t be less than 3 months)
                  </li>
                </ol>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-10">
            <button
              onClick={handleContinue}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-100 transition-all active:scale-[0.98]"
            >
              Continue
            </button>

            <button
              onClick={onBack}
              className="w-full py-3.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KYCInitiation;