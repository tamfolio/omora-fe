"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CiCircleQuestion } from "react-icons/ci";
import DepositModal from "./deposit-modal/page";
import WalletHistory from "./wallet-history/page";
import WithdrawModal from "./withdraw-modal/page";

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

export default function FundWalletComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawCurrency, setWithdrawCurrency] = useState<"NGN" | "USDT">(
    "NGN",
  );
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
    // Add your withdrawal processing logic here
    setIsWithdrawModalOpen(false);
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleGoBackToWallet = () => {
    setIsWithdrawModalOpen(false);
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
      <div className="max-w-6xl mx-auto px-6 py-8">
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
          {/* Balance Cards Container - Now Horizontal */}
          <div className="flex gap-6 mb-2">
            {/* Naira Balance Card */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Naira Balance
                </span>
                <Tooltip content="Your Naira balance. Fund this wallet directly in NGN and convert to USDC for investments or payouts.">
                  <CiCircleQuestion className="w-5 h-5 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                NGN {displayBalances.naira?.toLocaleString() || "0"}
              </div>
            </div>

            {/* USDT Balance Card */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  USDT Balance
                </span>
                <Tooltip content="Your earnings wallet. After a recurring investment is completed, both your capital and returns move here. From this wallet, you can withdraw to an external wallet address or convert back to NGN. ">
                  <CiCircleQuestion className="w-5 h-5 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {displayBalances.usdt?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-500 mt-1">USDT</div>
              </div>
            </div>

            {/* USDC Balance Card */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  USDC Balance
                </span>
                <Tooltip content="This is your investment wallet. Naira deposits convert to USDC here. ">
                  <CiCircleQuestion className="w-5 h-5 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {displayBalances.usdc?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-500 mt-1">USDC</div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Slightly offset centered */}
          <div className="flex justify-center gap-6 mb-8 mx-16">
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

          {/* Auto Convert Option */}
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoConvert}
                onChange={(e) => setAutoConvert(e.target.checked)}
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
              />
              <span className="ml-3 text-sm text-gray-700">
                Automatically Convert my Naira to USDC within 24hours
              </span>
            </label>
          </div>
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
