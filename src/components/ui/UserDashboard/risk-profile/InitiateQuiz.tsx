import React from 'react';

interface InitiateQuizProps {
  onStartQuiz?: () => void;
  onClose?: () => void;
}

function InitiateQuiz({ onStartQuiz, onClose }: InitiateQuizProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
          Omora Risk Profiling Quiz
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          As a verified user, taking this quiz enables Omora to recommend an appropriate investment strategy for you.
        </p>

        {/* Info text */}
        <p className="text-cyan-600 text-sm text-center mb-8">
          You must complete quiz to proceed to the next step.
        </p>

        {/* Start Quiz button */}
        <button
          onClick={onStartQuiz}
          className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-colors duration-200 hover:opacity-90"
          style={{ backgroundColor: '#008B99' }}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default InitiateQuiz;