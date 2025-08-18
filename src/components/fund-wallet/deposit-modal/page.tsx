"use client"
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('1000000');
  const router = useRouter();

  if (!isOpen) return null;

  const handleDeposit = () => {
    // Navigate to CompleteYourDeposit component with the amount
    router.push(`/dashboard/fund-wallet/complete-your-deposit?amount=${amount}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Deposit into your Wallet</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
              placeholder="Enter amount"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Minimum deposit amount is ₦10,000</p>
        </div>

        {/* Deposit Button */}
        <button
          onClick={handleDeposit}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          Deposit
        </button>
      </div>
    </div>
  );
}