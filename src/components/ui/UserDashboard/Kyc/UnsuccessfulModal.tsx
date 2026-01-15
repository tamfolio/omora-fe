import React from 'react';
import { AlertCircle } from 'lucide-react';

interface KycUnsuccessfulModalProps {
  onRetry?: () => void;
  onContactSupport?: () => void;
  message?: string;
}

function KycUnsuccessfulModal({ 
  onRetry, 
  onContactSupport,
  message = "Your KYC verification could not be completed at this time. Please try again or contact support for assistance."
}: KycUnsuccessfulModalProps) {
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const handleContactSupport = () => {
    if (onContactSupport) {
      onContactSupport();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Verification Incomplete
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full py-4 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
          
          <button
            onClick={handleContactSupport}
            className="w-full py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-colors duration-200"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

export default KycUnsuccessfulModal;