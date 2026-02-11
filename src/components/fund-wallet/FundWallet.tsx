"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/contexts/UserDataContext";
import DepositModal from "./DepositModal";
import WalletHistory from "./WalletHistory";
import WithdrawModal from "./withdraw-modal/WithdrawModal";
import WalletCard from "./WalletCard";
import ToggleSwitch from "./ToggleSwitch";
import WalletVerificationModal from "./WalletVerificationModal";
import { FiHeadphones } from "react-icons/fi";

// Types
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

export default function FundWalletComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawCurrency, setWithdrawCurrency] = useState<"NGN" | "USDT">("NGN");
  const [autoConvert, setAutoConvert] = useState(false);
  
  // ✅ Get data from context - NO POLLING NEEDED!
  const { userData, loading } = useUserData();
  const router = useRouter();

  // ✅ Check verification instantly from context data
  const ngnWallet = userData?.wallets?.find((w: any) => w.currency === 'NGN');
  const isVerified = !!ngnWallet?.accountNumber;
  const verificationType = userData?.business?.businessId ? 'corporate' : 'individual';

  const userBalances = {
    naira: ngnWallet?.availableBalance || 0,
    usdc: userData?.wallets?.find((w: any) => w.currency === 'USDC')?.availableBalance || 0,
    usdt: userData?.wallets?.find((w: any) => w.currency === 'USDT')?.availableBalance || 0,
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

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