"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DepositModal from './deposit-modal/page';
import WalletHistory from './wallet-history/page';

// Types
interface UserBalances {
  usd: number;
  naira: number;
  usdt: number;
}

// Custom hook to manage user deposit state
function useUserDeposits() {
  const [hasDeposits, setHasDeposits] = useState(false);
  const [userBalances, setUserBalances] = useState({
    usd: 0,
    naira: 0,
    usdt: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDepositHistory = async () => {
      try {
        // Simulate API call - replace with real API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check localStorage or make API call to get user's deposit history
        const hasDepositsStored = localStorage.getItem('userHasDeposits') === 'true';
        const storedBalances = localStorage.getItem('userBalances');
        
        if (hasDepositsStored && storedBalances) {
          setHasDeposits(true);
          setUserBalances(JSON.parse(storedBalances));
        }
        
      } catch (error) {
        console.error('Error checking deposits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDepositHistory();
  }, []);

  const updateUserDeposits = (newBalances: UserBalances) => {
    setHasDeposits(true);
    setUserBalances(newBalances);
    localStorage.setItem('userHasDeposits', 'true');
    localStorage.setItem('userBalances', JSON.stringify(newBalances));
  };

  return { hasDeposits, userBalances, isLoading, updateUserDeposits };
}

export default function FundWalletComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasDeposits, userBalances, isLoading } = useUserDeposits();
  const router = useRouter();

  const handleConvert = (currency: string) => {
    router.push(`/dashboard/fund-wallet/convert-money?from=${currency}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Use real balances if user has deposits, otherwise show zeros
  const displayBalances = hasDeposits ? userBalances : {
    usd: 0,
    naira: 0,
    usdt: 0
  };

  return (
    <>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Omora Wallet</h1>
          <p className="text-gray-600">Secure long-term returns and grow your crypto holdings</p>
        </div>

        {/* Wallet Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mb-8">
          {/* USD Account */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">USD Account</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {displayBalances.usd.toLocaleString()}
                </span>
                <span className="text-lg font-semibold text-gray-600 mb-1">USD</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-gray-500 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Withdraw
              </button>
              <button 
                onClick={() => handleConvert('USD')}
                className="flex-1 px-3 py-2 text-gray-500 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Convert
              </button>
            </div>
          </div>

          {/* Naira Account */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Naira Account</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-lg font-semibold text-gray-600 mb-1">₦</span>
                <span className="text-3xl font-bold text-gray-900">
                  {displayBalances.naira.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Fund Wallet
              </button>
              <button className="flex-1 px-3 py-2 text-gray-500 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Withdraw
              </button>
              <button 
                onClick={() => handleConvert('NGN')}
                className="flex-1 px-3 py-2 text-gray-500 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Convert
              </button>
            </div>
          </div>

          {/* USDT Account */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">USDT Account</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {displayBalances.usdt.toLocaleString()}
                </span>
                <span className="text-lg font-semibold text-gray-600 mb-1">USDT</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-gray-500 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Withdraw
              </button>
              <button 
                onClick={() => handleConvert('USDT')}
                className="flex-1 px-3 py-2 text-gray-500 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Convert
              </button>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="mb-8">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Conversion Rate:</span> 1 USDT = ₦1,3800
          </p>
        </div>

        {/* Wallet History - Show for all users (for testing) */}
        <div className="mb-8">
          <WalletHistory />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-500">© 2025 OMORA. All rights reserved.</p>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
          <span className="text-white font-bold text-lg">J</span>
        </button>
      </div>

      {/* Deposit Modal */}
      <DepositModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}