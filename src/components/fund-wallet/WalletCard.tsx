import React, { useState, useEffect } from "react";
import { CiCircleQuestion } from "react-icons/ci";
import { IoCopyOutline } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { apiFetch } from "@/lib/apiService"
import { useUserData } from "@/contexts/UserDataContext";

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
        <div className="absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
          {content}
          <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
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
      className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded transition-colors"
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <span className="text-xs font-medium text-green-500">Copied!</span>
      ) : (
        <IoCopyOutline className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
};

interface WalletCardProps {
  type: 'naira' | 'usdt' | 'usdc';
  balance: number;
  tooltipContent: string;
}

interface WalletDetails {
  accountNumber?: string;
  bankName?: string;
  accountName?: string;
  walletAddress?: string;
  network?: string;
}

const WalletCard: React.FC<WalletCardProps> = ({ type, balance, tooltipContent }) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [walletDetails, setWalletDetails] = useState<WalletDetails>({});
const { userData, loading: contextLoading } = useUserData();
const [localLoading, setLocalLoading] = useState(true);

useEffect(() => {
  if (userData) {
    const { wallets, user, business } = userData;
    
    // Find wallet by currency
    let wallet;
    if (type === 'naira') {
      wallet = wallets?.find((w: any) => w.currency === 'NGN');
    } else if (type === 'usdt') {
      wallet = wallets?.find((w: any) => w.currency === 'USDT');
    } else if (type === 'usdc') {
      wallet = wallets?.find((w: any) => w.currency === 'USDC');
    }
    
    if (wallet) {
      // ✅ Use business name for corporate accounts
      const accountName = business?.businessName || `${user.firstName} ${user.lastName}`;
      
      setWalletDetails({
        accountNumber: wallet.accountNumber,
        bankName: wallet.bankName,
        walletAddress: wallet.walletAddress,
        network: wallet.network,
        accountName: accountName
      });
    }
    
    setLocalLoading(false);

  }
}, [userData, type]);

  const getCardContent = () => {
    switch (type) {
      case 'naira':
        return {
          title: 'Naira Balance',
          balanceDisplay: `NGN ${balance?.toLocaleString() || "0"}`,
         details: contextLoading ?  (
            <div className="text-sm text-gray-500">Loading account details...</div>
          ) : walletDetails.accountNumber ? (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="font-medium">{walletDetails.bankName}</div>
              <div className="flex items-center justify-between">
                <span>Account Name: <span className="font-medium">{walletDetails.accountName}</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span>Account Number: <span className="font-medium">{walletDetails.accountNumber}</span></span>
                <CopyButton text={walletDetails.accountNumber} />
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Account details unavailable</div>
          )
        };
      
      case 'usdt':
        return {
          title: 'USDT Balance',
          balanceDisplay: (
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">USDT</div>
              <div className="text-3xl font-bold text-gray-900">
                {balance?.toLocaleString() || "0"}
              </div>
            </div>
          ),
         details: contextLoading ? (
            <div className="text-sm text-gray-500">Loading wallet details...</div>
          ) : walletDetails.walletAddress ? (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Network: <span className="font-medium">{walletDetails.network?.toUpperCase()}</span> - <span className="font-mono text-xs">{walletDetails.walletAddress}</span></span>
                <CopyButton text={walletDetails.walletAddress} />
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Wallet address unavailable</div>
          )
        };
      
      case 'usdc':
        return {
          title: 'USDC Balance',
          balanceDisplay: (
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">USDC</div>
              <div className="text-3xl font-bold text-gray-900">
                {balance?.toLocaleString() || "0"}
              </div>
            </div>
          ),
          details: contextLoading ? (
            <div className="text-sm text-gray-500">Loading wallet details...</div>
          ) : walletDetails.walletAddress ? (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Network: <span className="font-medium">{walletDetails.network?.toUpperCase()}</span> - <span className="font-mono text-xs">{walletDetails.walletAddress}</span></span>
                <CopyButton text={walletDetails.walletAddress} />
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Wallet address unavailable</div>
          )
        };
    }
  };

  const cardContent = getCardContent();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            {cardContent.title}
          </span>
          <Tooltip content={tooltipContent}>
            <CiCircleQuestion className="w-5 h-5 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
        
        <button
          onClick={() => setIsBalanceVisible(!isBalanceVisible)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isBalanceVisible ? (
            <FiEye className="w-5 h-5" />
          ) : (
            <FiEyeOff className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className="mb-6">
        {isBalanceVisible ? (
          typeof cardContent.balanceDisplay === 'string' ? (
            <div className="text-3xl font-bold text-gray-900">
              {cardContent.balanceDisplay}
            </div>
          ) : (
            cardContent.balanceDisplay
          )
        ) : (
          <div className="text-3xl font-bold text-gray-400">
            ••••••
          </div>
        )}
      </div>
      
      {cardContent.details}
    </div>
  );
};

export default WalletCard;