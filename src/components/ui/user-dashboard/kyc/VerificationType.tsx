import React, { useState } from 'react';
import { ArrowLeft, User, Building2 } from 'lucide-react';

type VerificationType = 'individual' | 'corporate' | null;

interface VerificationTypeProps {
  onNext: () => void;
  onBack: () => void;
}

function VerificationType({ onNext, onBack }: VerificationTypeProps) {
  const [selectedType, setSelectedType] = useState<VerificationType>(null);

  const handleSelection = (type: VerificationType) => {
    setSelectedType(type);
    console.log('Selected type:', type);
    // Automatically proceed to next step when selection is made
    onNext();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-800">MORA</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Step 1/5</span>
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center relative">
            <span className="text-sm font-semibold text-teal-500">20%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-12">
            Are you Corporate or Individual?
          </h1>

          <div className="space-y-4">
            {/* Individual Option */}
            <div
              onClick={() => handleSelection('individual')}
              className={`w-full p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedType === 'individual'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  selectedType === 'individual' ? 'bg-teal-100' : 'bg-gray-100'
                }`}>
                  <User className={`w-6 h-6 ${
                    selectedType === 'individual' ? 'text-teal-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Individual
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Invest as a private client and enjoy automated crypto portfolio growth with full control and visibility
                  </p>
                </div>
              </div>
            </div>

            {/* Corporate Option */}
            <div
              onClick={() => handleSelection('corporate')}
              className={`w-full p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedType === 'corporate'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  selectedType === 'corporate' ? 'bg-teal-100' : 'bg-gray-100'
                }`}>
                  <Building2 className={`w-6 h-6 ${
                    selectedType === 'corporate' ? 'text-teal-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Corporate
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Set up an institutional account to manage team access, fund investments, and streamline reporting at scale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationType;