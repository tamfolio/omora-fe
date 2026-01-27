import React from 'react';

interface QuizResultProps {
  riskProfile: 'aggressive' | 'balanced' | 'conservative';
  onAccept?: () => void;
  onChangeProfile?: () => void;
  onClose?: () => void;
}

interface RiskProfileData {
  title: string;
  emoji: string;
  description: string;
}

const riskProfiles: Record<string, RiskProfileData> = {
  aggressive: {
    title: "Aggressive: You're Bold and Growth-Oriented",
    emoji: "🚀",
    description: "You're willing to embrace market swings for the chance at higher returns. Your portfolio will favor trending altcoins and higher-risk tokens, with lower allocation to stablecoins. Expect more volatility — and potentially bigger gains."
  },
  balanced: {
    title: "Balanced: You're a Strategic Investor",
    emoji: "⚖️",
    description: "You prefer a mix of growth and stability. Your portfolio will combine blue-chip tokens like BTC and ETH with some altcoins, balancing long-term growth with reduced risk exposure. You're on track for steady returns, with room to optimize as you go."
  },
  conservative: {
    title: "Conservative: You Prioritize Stability",
    emoji: "🛡️",
    description: "You're focused on preserving your capital and minimizing risk. Your portfolio will concentrate on stablecoins and major cryptocurrencies like BTC and ETH, with limited exposure to volatile altcoins. This approach is ideal if you're new to crypto or prefer consistent, low-risk growth. You can update your risk profile anytime from Settings."
  }
};

function QuizResult({ riskProfile, onAccept, onChangeProfile, onClose }: QuizResultProps) {
  const profileData = riskProfiles[riskProfile];

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

        {/* Title with emoji */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
          {profileData.title}{profileData.emoji}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          {profileData.description}
        </p>

        {/* Action buttons */}
        <div className="space-y-3">
          {/* Accept button */}
          <button
            onClick={onAccept}
            className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-colors duration-200 hover:opacity-90"
            style={{ backgroundColor: '#008B99' }}
          >
            Accept
          </button>

          {/* Change risk profile button */}
          <button
            onClick={onChangeProfile}
            className="w-full py-3 px-6 text-gray-600 font-semibold rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-50"
          >
            Change risk profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;