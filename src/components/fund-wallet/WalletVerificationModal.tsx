import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WalletVerificationModalProps {
  isOpen: boolean;
  verificationType: 'individual' | 'corporate';
}

export default function WalletVerificationModal({ isOpen, verificationType }: WalletVerificationModalProps) {
  const router = useRouter();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verification in Progress
        </h2>
        
        <p className="text-gray-600 mb-6">
          {verificationType === 'corporate' 
            ? "Your company documents are currently under review by our team. You'll be able to access your wallet once verification is complete."
            : "Your KYC verification is being processed. You'll be able to access your wallet once verification is complete."}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm text-blue-900">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Our team reviews your {verificationType === 'corporate' ? 'documents' : 'information'}</li>
                <li>• You'll receive an email notification</li>
                <li>• Your wallet will be automatically activated</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          <p>⏱️ Verification usually takes 24-48 hours</p>
        </div>

        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}