"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DepositModal from "./DepositModal";
import WalletHistory from "./WalletHistory";
import WithdrawModal from "./withdraw-modal/WithdrawModal";
import WalletCard from "./WalletCard";
import ToggleSwitch from "./ToggleSwitch";
import WalletVerificationModal from "./WalletVerificationModal";
import { FiHeadphones } from "react-icons/fi";

// Types
interface UserBalances {
  usdc: number;
  naira: number;
  usdt: number;
}

interface WithdrawData {
  currency: "NGN" | "USDT";
  amount: number;
  serviceFee: number;
  bankAccount?: string;
  accountNumber?: string;
  accountName?: string;
  walletAddress?: string;
  network?: string;
  description: string;
}

function useWalletVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationType, setVerificationType] = useState<'individual' | 'corporate'>('individual');
  const [isPolling, setIsPolling] = useState(true);
  const [userBalances, setUserBalances] = useState<UserBalances>({
    usdc: 0,
    naira: 0,
    usdt: 0,
  });

  useEffect(() => {
    const checkWalletStatus = async () => {
      try {
        const response = await fetch('/api/proxy/user/api/v1/me');
        const result = await response.json();

        if (result.status === 'success' && result.data) {
          const { wallets, business } = result.data;

          // Determine if corporate based on business object
          if (business && business.businessId) {
            setVerificationType('corporate');
          }

          // Check if NGN wallet has account number (verification complete)
          const ngnWallet = wallets?.find((w: any) => w.currency === 'NGN');
          
          if (ngnWallet?.accountNumber) {
            setIsVerified(true);
            setIsPolling(false);

            // Set balances
            const usdcWallet = wallets.find((w: any) => w.currency === 'USDC');
            const usdtWallet = wallets.find((w: any) => w.currency === 'USDT');
            
            setUserBalances({
              naira: ngnWallet.availableBalance || 0,
              usdc: usdcWallet?.availableBalance || 0,
              usdt: usdtWallet?.availableBalance || 0,
            });
          }
        }
      } catch (error) {
        console.error('Error checking wallet status:', error);
      }
    };

    // Initial check
    checkWalletStatus();

    // Poll every 30 seconds if not verified
    let pollInterval: NodeJS.Timeout;
    if (isPolling && !isVerified) {
      pollInterval = setInterval(checkWalletStatus, 30000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isPolling, isVerified]);

  return { isVerified, verificationType, userBalances };
}

export default function FundWalletComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawCurrency, setWithdrawCurrency] = useState<"NGN" | "USDT">("NGN");
  const [autoConvert, setAutoConvert] = useState(false);
  const { isVerified, verificationType, userBalances } = useWalletVerification();
  const router = useRouter();

  const handleConvert = (currency: string) => {
    if (!isVerified) return;
    router.push(`/dashboard/fund-wallet/convert-money?from=${currency}`);
  };

  const handleWithdraw = (currency: "NGN" | "USDT") => {
    if (!isVerified) return;
    setWithdrawCurrency(currency);
    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawSubmit = (withdrawData: WithdrawData) => {
    console.log("Processing withdrawal:", withdrawData);
    setIsWithdrawModalOpen(false);
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleGoBackToWallet = () => {
    setIsWithdrawModalOpen(false);
  };

  const toggleAutoConvert = () => {
    if (!isVerified) return;
    setAutoConvert(!autoConvert);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* Verification Overlay - makes content visible but not interactive */}
        {!isVerified && (
          <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-10 pointer-events-none" />
        )}

        <div className={!isVerified ? 'pointer-events-none' : ''}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Omora Wallet
            </h1>
            <p className="text-gray-600">
              Secure long-term returns and grow your crypto holdings
            </p>
          </div>

          {/* Main Wallet Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            {/* Balance Cards Container */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <WalletCard
                type="naira"
                balance={userBalances.naira}
                tooltipContent="Your Naira balance. Fund this wallet directly in NGN and convert to USDC for investments or payouts."
              />
              
              <WalletCard
                type="usdt"
                balance={userBalances.usdt}
                tooltipContent="Your earnings wallet. After a recurring investment is completed, both your capital and returns move here."
              />
              
              <WalletCard
                type="usdc"
                balance={userBalances.usdc}
                tooltipContent="This is your investment wallet. Naira deposits convert to USDC here."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mb-8">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!isVerified}
                className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-24 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Fund Wallet
              </button>

              <button
                onClick={() => handleWithdraw("USDT")}
                disabled={!isVerified}
                className="px-24 py-3 text-gray-600 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw
              </button>

              <button
                onClick={() => handleConvert("USDC")}
                disabled={!isVerified}
                className="px-24 py-3 text-gray-600 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Convert
              </button>
            </div>

            {/* Auto Convert Toggle */}
            <ToggleSwitch
              isOn={autoConvert}
              onToggle={toggleAutoConvert}
              label="Automatically Convert my Naira to USDC within 24hours"
              rightContent={
                <>
                  <span>Withdrawal Limit: NGN 2,000,000</span>
                  <button className="ml-2 text-teal-600 hover:text-teal-700 underline">
                    upgrade now
                  </button>
                </>
              }
            />
          </div>

          {/* Wallet History */}
          <div className="mb-8">
            <WalletHistory />
          </div>
        </div>
      </div>

      {/* Verification Modal - Shows when wallet not verified */}
      <WalletVerificationModal 
        isOpen={!isVerified} 
        verificationType={verificationType}
      />

       {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6">
              <button className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
                <FiHeadphones className="text-white text-lg" />
              </button>
            </div>

      {/* Modals */}
      <DepositModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdrawSubmit}
        onGoToDashboard={handleGoToDashboard}
        onGoBackToWallet={handleGoBackToWallet}
        initialCurrency={withdrawCurrency}
      />
    </>
  );
}