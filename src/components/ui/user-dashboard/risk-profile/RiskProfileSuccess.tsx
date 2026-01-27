import React from 'react';

interface RiskProfileSuccessProps {
  onGoToDashboard?: () => void;
  onClose?: () => void;
}

function RiskProfileSuccess({ onGoToDashboard, onClose }: RiskProfileSuccessProps) {
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
        {/* Success checkmark icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
          Successful!
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          Your Risk Profile has been Set!
        </p>

        {/* Go to Dashboard button */}
        <button
          onClick={onGoToDashboard}
          className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-colors duration-200 hover:opacity-90"
          style={{ backgroundColor: '#008B99' }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default RiskProfileSuccess;