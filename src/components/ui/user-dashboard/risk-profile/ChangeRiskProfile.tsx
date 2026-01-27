import React, { useState } from 'react';

interface ChangeRiskProfileProps {
  currentProfile?: 'conservative' | 'balanced' | 'aggressive';
  onContinue?: (selectedProfile: string) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

function ChangeRiskProfile({ 
  currentProfile = 'balanced', 
  onContinue, 
  onCancel, 
  onClose 
}: ChangeRiskProfileProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>(currentProfile);
  const [understandRisk, setUnderstandRisk] = useState<boolean>(false);

  const handleContinue = () => {
    if (onContinue && selectedProfile && understandRisk) {
      onContinue(selectedProfile);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const canContinue = selectedProfile && understandRisk;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(10, 13, 18, 0.7)' }}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl">
        {/* Close button (top right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Warning icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-orange-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
          Choose a Different Profile
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          You are choosing a different risk level than recommended. This may result in more volatility.
        </p>

        {/* Risk Profile Options */}
        <div className="space-y-4 mb-6">
          {/* Conservative */}
          <label className="flex items-center cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="riskProfile"
                value="conservative"
                checked={selectedProfile === 'conservative'}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                ${selectedProfile === 'conservative' 
                  ? 'border-cyan-600 bg-cyan-600' 
                  : 'border-gray-300'
                }
              `}>
                {selectedProfile === 'conservative' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="text-gray-700 font-medium">Conservative</span>
            </div>
          </label>

          {/* Balanced */}
          <label className="flex items-center cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="riskProfile"
                value="balanced"
                checked={selectedProfile === 'balanced'}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                ${selectedProfile === 'balanced' 
                  ? 'border-cyan-600 bg-cyan-600' 
                  : 'border-gray-300'
                }
              `}>
                {selectedProfile === 'balanced' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="text-gray-700 font-medium">Balanced</span>
            </div>
          </label>

          {/* Aggressive */}
          <label className="flex items-center cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="riskProfile"
                value="aggressive"
                checked={selectedProfile === 'aggressive'}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                ${selectedProfile === 'aggressive' 
                  ? 'border-cyan-600 bg-cyan-600' 
                  : 'border-gray-300'
                }
              `}>
                {selectedProfile === 'aggressive' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="text-gray-700 font-medium">Aggressive</span>
            </div>
          </label>
        </div>

        {/* Risk acknowledgment checkbox */}
        <div className="mb-8">
          <label className="flex items-start cursor-pointer">
            <div className="flex items-center mt-0.5">
              <input
                type="checkbox"
                checked={understandRisk}
                onChange={(e) => setUnderstandRisk(e.target.checked)}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 border-2 rounded flex items-center justify-center mr-3
                ${understandRisk 
                  ? 'border-cyan-600 bg-cyan-600' 
                  : 'border-gray-300'
                }
              `}>
                {understandRisk && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-gray-700 text-sm">I understand the risk</span>
            </div>
          </label>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`
              w-full py-3 px-6 font-semibold rounded-lg transition-colors duration-200
              ${canContinue
                ? 'text-white hover:opacity-90'
                : 'text-gray-400 cursor-not-allowed'
              }
            `}
            style={{ 
              backgroundColor: canContinue ? '#008B99' : '#e5e7eb'
            }}
          >
            Continue
          </button>

          {/* Cancel button */}
          <button
            onClick={handleCancel}
            className="w-full py-3 px-6 text-gray-600 font-semibold rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeRiskProfile;