"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/contexts/UserDataContext";
import kycApiService from "@/lib/kyc-api-service"; 
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
  
  // Polling States
  const [isPollingAccount, setIsPollingAccount] = useState(false);
  const [isPollingWallet, setIsPollingWallet] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { userData, loading } = useUserData();
  const router = useRouter();

  // 1. Identify Wallet Status
  const ngnWallet = userData?.wallets?.find((w: any) => w.currency === 'NGN');
  const usdtWallet = userData?.wallets?.find((w: any) => w.currency === 'USDT');
  
  // Check Verification (Has NGN Account Number)
  const isVerified = !!ngnWallet?.accountNumber;
  
  // Check Crypto Status
  const hasCryptoWallet = !!usdtWallet?.walletAddress;
  
  // ✅ Check Funding Status (Only poll for crypto wallet if they have money)
  const hasFunded = (ngnWallet?.availableBalance || 0) > 0;
  
  const verificationType = userData?.business?.businessId ? 'corporate' : 'individual';

  const userBalances = {
    naira: ngnWallet?.availableBalance || 0,
    usdc: userData?.wallets?.find((w: any) => w.currency === 'USDC')?.availableBalance || 0,
    usdt: userData?.wallets?.find((w: any) => w.currency === 'USDT')?.availableBalance || 0,
  };

  // ✅ POLLING LOGIC
  useEffect(() => {
    // 1. Account Number Polling
    // Runs if: User exists, Not Verified (No NGN Account), and Not already polling
    if (!loading && userData && !isVerified && !isPollingAccount) {
      startAccountPolling();
    }
    
    // 2. Crypto Wallet Polling
    // Runs ONLY if: Verified, Has Funded (Balance > 0), Missing Crypto Wallet, Not polling
    if (!loading && userData && isVerified && hasFunded && !hasCryptoWallet && !isPollingWallet) {
      startWalletPolling();
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [userData, loading, isVerified, hasCryptoWallet, hasFunded]); 

  const startAccountPolling = async () => {
    setIsPollingAccount(true);
    let attempts = 0;
    const maxAttempts = 10; // Poll for ~30 seconds

    const poll = async () => {
      try {
        console.log("🔄 Polling for Account Number...");
        const response = await kycApiService.pollOnboarding('account-number');
        
        if (response.status === 'success') {
          console.log("✅ Account Number Created!");
          setIsPollingAccount(false);
          window.location.reload(); // Refresh to update context
          return;
        }

        if (response.status === 'failed') {
          console.error("❌ Account Generation Failed");
          setIsPollingAccount(false);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          pollIntervalRef.current = setTimeout(poll, 3000);
        } else {
          setIsPollingAccount(false); // Stop after max attempts
        }
      } catch (error) {
        console.error("Polling Error:", error);
        setIsPollingAccount(false);
      }
    };
    poll();
  };

  const startWalletPolling = async () => {
    setIsPollingWallet(true);
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      try {
        console.log("🔄 Polling for Crypto Wallets...");
        const response = await kycApiService.pollOnboarding('wallet');
        
        if (response.status === 'success') {
          console.log("✅ Crypto Wallets Created!");
          setIsPollingWallet(false);
          window.location.reload(); 
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          pollIntervalRef.current = setTimeout(poll, 3000);
        } else {
          setIsPollingWallet(false);
        }
      } catch (error) {
        console.error("Wallet Polling Error:", error);
        setIsPollingWallet(false);
      }
    };
    poll();
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
        
        {/* Verification Overlay - Show if NOT verified AND NOT polling account */}
        {!isVerified && !isPollingAccount && (
          <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-10 pointer-events-none" />
        )}

        {/* Polling / Generation Overlay */}
        {(isPollingAccount || isPollingWallet) && (
           <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-xl">
             <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <h2 className="text-xl font-bold text-gray-900">
               {isPollingAccount ? "Generating Account Number..." : "Creating Investment Wallets..."}
             </h2>
             <p className="text-gray-600 mt-2">
               {isPollingAccount 
                 ? "Please wait while we set up your banking details." 
                 : "We detected your deposit! Creating your crypto wallets..."}
             </p>
           </div>
        )}

        <div className={!isVerified && !isPollingAccount ? 'pointer-events-none' : ''}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Omora Wallet
            </h1>
            <p className="text-gray-600">
              Secure long-term returns and grow your crypto holdings
            </p>
          </div>

          {/* Main Wallet Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 relative">
            
            {/* Balance Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!isVerified}
                className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-12 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Fund Wallet
              </button>

              <button
                onClick={() => handleWithdraw("USDT")}
                disabled={!isVerified}
                className="px-12 py-3 text-gray-600 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw
              </button>

              <button
                onClick={() => handleConvert("USDC")}
                disabled={!isVerified}
                className="px-12 py-3 text-gray-600 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span className="hidden sm:inline">Withdrawal Limit: NGN 2,000,000</span>
                  <button className="ml-2 text-teal-600 hover:text-teal-700 underline text-sm">
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

      {/* Verification Modal - Shows ONLY if not verified AND not currently polling */}
      {!isPollingAccount && (
        <WalletVerificationModal 
          isOpen={!isVerified} 
          verificationType={verificationType}
        />
      )}

       {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
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