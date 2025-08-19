import React from 'react';
import { FiCheck } from 'react-icons/fi';

interface WithdrawalSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
  onGoBackToWallet: () => void;
  withdrawalData?: {
    amount: number;
    currency: string;
    type: 'withdrawal' | 'conversion';
  };
}

export default function WithdrawalSuccessModal({ 
  isOpen, 
  onClose, 
  onGoToDashboard,
  onGoBackToWallet,
  withdrawalData 
}: WithdrawalSuccessModalProps) {
  if (!isOpen) return null;

  const getTitle = () => {
    if (withdrawalData?.type === 'conversion') {
      return 'Conversion Successfully';
    }
    return 'Withdrawal Successfully';
  };

  const getDescription = () => {
    if (withdrawalData?.type === 'conversion') {
      return 'You have successfully converted';
    }
    return 'You have successfully withdrawn';
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <FiCheck className="w-6 h-6 text-white stroke-2" />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {getTitle()}
          </h2>
          
          <p className="text-gray-600 text-sm mb-8">
            {getDescription()}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onGoToDashboard}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              OK, Take Me to Dashboard
            </button>
            
            <button
              onClick={onGoBackToWallet}
              className="w-full text-gray-600 hover:text-gray-900 py-3 font-medium transition-colors"
            >
              Go Back to Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}