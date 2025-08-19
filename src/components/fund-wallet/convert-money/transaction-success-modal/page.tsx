"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

interface TransactionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversionData: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: string;
    toAmount: string;
  };
}

export default function TransactionSuccessModal({ isOpen, onClose, conversionData }: TransactionSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleBackToBalance = () => {
    // Mock: Update localStorage balances (in production this would be handled by API)
    const currentBalances = JSON.parse(localStorage.getItem('userBalances') || '{"usdc": 0, "naira": 0, "usdt": 0}');
    
    // Update balances based on conversion
    if (conversionData.fromCurrency === 'NGN') {
      currentBalances.naira = Math.max(0, currentBalances.naira - parseFloat(conversionData.fromAmount));
      if (conversionData.toCurrency === 'USDT') {
        currentBalances.usdt += parseFloat(conversionData.toAmount);
      } else if (conversionData.toCurrency === 'USDC') {
        currentBalances.usdc += parseFloat(conversionData.toAmount); // Using USDC field for USDC
      }
    } else if (conversionData.fromCurrency === 'USDT') {
      currentBalances.usdt = Math.max(0, currentBalances.usdt - parseFloat(conversionData.fromAmount));
      if (conversionData.toCurrency === 'NGN') {
        currentBalances.naira += parseFloat(conversionData.toAmount);
      } else if (conversionData.toCurrency === 'USDC') {
        currentBalances.usdc += parseFloat(conversionData.toAmount);
      }
    } else if (conversionData.fromCurrency === 'USDC') {
      currentBalances.usdc = Math.max(0, currentBalances.usdc - parseFloat(conversionData.fromAmount));
      if (conversionData.toCurrency === 'USDT') {
        currentBalances.usdt += parseFloat(conversionData.toAmount);
      }
    }

    // Save updated balances and ensure user has deposits flag
    localStorage.setItem('userBalances', JSON.stringify(currentBalances));
    localStorage.setItem('userHasDeposits', 'true');
    
    // Close modal and navigate back to fund wallet
    onClose();
    router.push('/dashboard/fund-wallet');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Funds Converted Successfully</h2>
          
          {/* Success Message */}
          <p className="text-sm text-gray-600 mb-1">
            You have successfully converted {conversionData.fromCurrency} {parseFloat(conversionData.fromAmount).toLocaleString()} to {conversionData.toCurrency} {conversionData.toAmount}.
          </p>
          <p className="text-xs text-gray-500">
            The conversion will reflect in your wallet.
          </p>
        </div>

        {/* Back to Balance Button */}
        <button
          onClick={handleBackToBalance}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Back to balance
        </button>
      </div>
    </div>
  );
}