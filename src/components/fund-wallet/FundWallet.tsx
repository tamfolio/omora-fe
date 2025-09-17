"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DepositModal from "./DepositModal";
import WalletHistory from "./WalletHistory";
import WithdrawModal from "./withdraw-modal/WithdrawModal";
import WalletCard from "./WalletCard";
import ToggleSwitch from "./ToggleSwitch";

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

// Custom hook to manage user deposit state
function useUserDeposits() {
  const [hasDeposits, setHasDeposits] = useState(false);
  const [userBalances, setUserBalances] = useState<UserBalances>({
    usdc: 0,
    naira: 0,
    usdt: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkDepositHistory = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (typeof window !== "undefined") {
          const hasDepositsStored =
            localStorage.getItem("userHasDeposits") === "true";
          const storedBalances = localStorage.getItem("userBalances");

          if (hasDepositsStored && storedBalances) {
            try {
              const balances = JSON.parse(storedBalances);
              setHasDeposits(true);
              setUserBalances(balances);
            } catch (error) {
              console.error("Error parsing stored balances:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error checking deposits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDepositHistory();
  }, []);

  const updateUserDeposits = (newBalances: UserBalances) => {
    setHasDeposits(true);
    setUserBalances(newBalances);

    if (typeof window !== "undefined") {
      localStorage.setItem("userHasDeposits", "true");
      localStorage.setItem("userBalances", JSON.stringify(newBalances));
    }
  };

  return { hasDeposits, userBalances, isLoading, updateUserDeposits, isClient };
}

export default function FundWalletComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawCurrency, setWithdrawCurrency] = useState<"NGN" | "USDT">("NGN");
  const [autoConvert, setAutoConvert] = useState(false);
  const { hasDeposits, userBalances, isLoading, isClient } = useUserDeposits();
  const router = useRouter();

  const handleConvert = (currency: string) => {
    router.push(`/dashboard/fund-wallet/convert-money?from=${currency}`);
  };

  const handleWithdraw = (currency: "NGN" | "USDT") => {
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
    setAutoConvert(!autoConvert);
  };

  // Show loading state while checking client-side state
  if (isLoading || !isClient) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayBalances = hasDeposits
    ? userBalances
    : {
        usdc: 0,
        naira: 0,
        usdt: 0,
      };

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8">
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
          {/* Balance Cards Container - Horizontal Layout */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <WalletCard
              type="naira"
              balance={displayBalances.naira}
              tooltipContent="Your Naira balance. Fund this wallet directly in NGN and convert to USDC for investments or payouts."
            />
            
            <WalletCard
              type="usdt"
              balance={displayBalances.usdt}
              tooltipContent="Your earnings wallet. After a recurring investment is completed, both your capital and returns move here. From this wallet, you can withdraw to an external wallet address or convert back to NGN."
            />
            
            <WalletCard
              type="usdc"
              balance={displayBalances.usdc}
              tooltipContent="This is your investment wallet. Naira deposits convert to USDC here."
            />
          </div>

          {/* Action Buttons - Centered */}
          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-24 rounded-xl text-sm font-medium transition-colors"
            >
              Fund Wallet
            </button>

            <button
              onClick={() => handleWithdraw("USDT")}
              className="px-24 py-3 text-gray-600 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Withdraw
            </button>

            <button
              onClick={() => handleConvert("USDC")}
              className="px-24 py-3 text-gray-600 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"
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

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-500">
          © 2025 OMORA. All rights reserved.
        </p>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
          <span className="text-white font-bold text-lg">J</span>
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