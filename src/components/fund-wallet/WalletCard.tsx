import React, { useState } from "react";
import { CiCircleQuestion } from "react-icons/ci";
import { IoCopyOutline } from "react-icons/io5";

// Tooltip Component
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

// Copy to clipboard component
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-gray-100 rounded transition-colors"
      title="Copy to clipboard"
    >
      <IoCopyOutline className="w-4 h-4 text-gray-400" />
    </button>
  );
};

interface WalletCardProps {
  type: 'naira' | 'usdt' | 'usdc';
  balance: number;
  tooltipContent: string;
}

const WalletCard: React.FC<WalletCardProps> = ({ type, balance, tooltipContent }) => {
  const getCardContent = () => {
    switch (type) {
      case 'naira':
        return {
          title: 'Naira Balance',
          balanceDisplay: `NGN ${balance?.toLocaleString() || "0"}`,
          details: (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="font-medium">Stanbic IBTC Bank</div>
              <div className="flex items-center justify-between">
                <span>Account Name: <span className="font-medium">John Doe Micham</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span>Account Number: <span className="font-medium">0123456789</span></span>
                <CopyButton text="0123456789" />
              </div>
            </div>
          )
        };
      
      case 'usdt':
        return {
          title: 'USDT Balance',
          balanceDisplay: (
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {balance?.toLocaleString() || "0"}
              </div>
              <div className="text-sm text-gray-500 mt-1">USDT</div>
            </div>
          ),
          details: (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Network: <span className="font-medium">TRC20</span> - <span className="font-mono text-xs">97d029797d60534a7d029797</span></span>
                <CopyButton text="97d029797d60534a7d029797" />
              </div>
              <div className="flex items-center justify-between">
                <span>Network: <span className="font-medium">BEP20</span> - <span className="font-mono text-xs">97d029797d60534a7d029797</span></span>
                <CopyButton text="97d029797d60534a7d029797" />
              </div>
            </div>
          )
        };
      
      case 'usdc':
        return {
          title: 'USDC Balance',
          balanceDisplay: (
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {balance?.toLocaleString() || "0"}
              </div>
              <div className="text-sm text-gray-500 mt-1">USDC</div>
            </div>
          ),
          details: (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Network: <span className="font-medium">TRC20</span> - <span className="font-mono text-xs">97d029797d60534a7d029797</span></span>
                <CopyButton text="97d029797d60534a7d029797" />
              </div>
              <div className="flex items-center justify-between">
                <span>Network: <span className="font-medium">BEP20</span> - <span className="font-mono text-xs">97d029797d60534a7d029797</span></span>
                <CopyButton text="97d029797d60534a7d029797" />
              </div>
            </div>
          )
        };
    }
  };

  const cardContent = getCardContent();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">
          {cardContent.title}
        </span>
        <Tooltip content={tooltipContent}>
          <CiCircleQuestion className="w-5 h-5 text-gray-400 cursor-help" />
        </Tooltip>
      </div>
      
      <div className="mb-6">
        {typeof cardContent.balanceDisplay === 'string' ? (
          <div className="text-3xl font-bold text-gray-900">
            {cardContent.balanceDisplay}
          </div>
        ) : (
          cardContent.balanceDisplay
        )}
      </div>
      
      {cardContent.details}
    </div>
  );
};

export default WalletCard;