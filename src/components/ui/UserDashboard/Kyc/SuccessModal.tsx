import React from 'react';
import { Check } from 'lucide-react';

interface KycSuccessModalProps {
  onGoToDashboard?: () => void;
}

function KycSuccessModal({ onGoToDashboard }: KycSuccessModalProps) {
  const handleGoToDashboard = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else {
      // For Next.js, you should pass a navigation function from the parent component
      // that uses useRouter or Link component
      console.log('Navigation to dashboard should be handled by parent component');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Successful!
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your KYC has been completed. We will update the status within 30mins.
        </p>

        {/* Dashboard Button */}
        <button
          onClick={handleGoToDashboard}
          className="w-full py-4 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default KycSuccessModal;