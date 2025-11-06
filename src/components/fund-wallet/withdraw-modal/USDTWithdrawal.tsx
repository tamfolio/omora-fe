import React, { useState } from "react";
import { ChevronDown } from "lucide-react";


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

interface USDTWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (withdrawData: WithdrawData) => void;
  onCurrencyChange?: (currency: "NGN" | "USDT") => void;
  onGoToDashboard?: () => void;
  onGoBackToWallet?: () => void;
}

const NETWORKS = ["BEP 20", "TRC 20", "SOLANA", "ERC 20"];
const USDT_SERVICE_FEE = 5;

const WITHDRAWAL_LIMIT = 2000;
const USDT_SPENT = 400;
const USDT_REMAINING = 1600;
const MIN_WITHDRAWAL = 100;
const MAX_WITHDRAWAL = 10000;

export default function USDTWithdrawModal({
  isOpen,
  onClose,
  onWithdraw,
  onCurrencyChange,
  onGoToDashboard,
  onGoBackToWallet,
}: USDTWithdrawModalProps) {
  const [amount, setAmount] = useState("25000");
  const [network, setNetwork] = useState("ERC 20");
  const [walletAddress, setWalletAddress] = useState("");
  const [description, setDescription] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingWithdrawData, setPendingWithdrawData] = useState<WithdrawData | undefined>(undefined);

  if (!isOpen) return null;

  const handleCurrencyChange = () => {
    if (onCurrencyChange) {
      onCurrencyChange("NGN");
    }
  };

  const handleWithdraw = () => {
    const withdrawData: WithdrawData = {
      currency: "USDT",
      amount: parseFloat(amount),
      serviceFee: USDT_SERVICE_FEE,
      walletAddress,
      network,
      description,
    };

    // Store withdraw data and show verification modal
    setPendingWithdrawData(withdrawData);
    setShowVerification(true);
  };

  const handleVerificationSuccess = () => {
    // Process the withdrawal after successful verification
    if (pendingWithdrawData) {
      onWithdraw(pendingWithdrawData);
    }
    setShowVerification(false);
  };

  const handleShowSuccess = () => {
    setShowSuccess(true);
  };

  const handleCloseVerification = () => {
    setShowVerification(false);
    setPendingWithdrawData(undefined);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setPendingWithdrawData(undefined);
    onClose();
  };

  const handleGoToDashboard = () => {
    handleCloseSuccess();
    onGoToDashboard?.();
  };

  const handleGoBackToWallet = () => {
    handleCloseSuccess();
    onGoBackToWallet?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl w-full max-w-sm">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Withdraw from your wallet
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Currency Tabs */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-4">
            <button
              onClick={handleCurrencyChange}
              className="flex-1 px-3 py-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50"
            >
              Naira
            </button>
            <div className="border-r border-gray-200"></div>
            <button className="flex-1 px-3 py-2 text-sm font-medium bg-gray-100 text-gray-900">
              USDT
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
              placeholder="Enter amount"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-0.5">
              <span>Min: {MIN_WITHDRAWAL} USDT</span>
              <span>Max: {MAX_WITHDRAWAL.toLocaleString()} USDT</span>
            </div>
          </div>

          {/* Network Selection */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Network
            </label>
            <div className="relative">
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white text-sm"
              >
                {NETWORKS.map((net) => (
                  <option key={net} value={net}>
                    {net}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Wallet Address with Check Icon */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                placeholder="Enter wallet address"
              />
              {walletAddress && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm"
              rows={2}
              placeholder="Optional description"
            />
          </div>

          {/* Withdrawal Limits */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">
                Withdrawal Limit: {WITHDRAWAL_LIMIT.toLocaleString()} USDT
              </span>
              <button className="text-xs text-teal-600 hover:text-teal-700">
                Upgrade Now
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(USDT_SPENT / WITHDRAWAL_LIMIT) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span className="text-teal-600">{USDT_SPENT} USDT used</span>
              <span className="text-green-600">
                {USDT_REMAINING.toLocaleString()} USDT remaining
              </span>
            </div>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium transition-colors mb-2"
          >
            Withdraw
          </button>

          {/* Processing Note */}
          <p className="text-xs text-gray-500 text-center">
            Only withdrawals are processed within 1 business day.
          </p>
        </div>
      </div>

      {/* Placeholder for Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Verification Required</h3>
            <p className="mb-4">Please verify your withdrawal request.</p>
            <div className="flex gap-2">
              <button 
                onClick={handleVerificationSuccess}
                className="px-4 py-2 bg-teal-600 text-white rounded"
              >
                Verify
              </button>
              <button 
                onClick={handleCloseVerification}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Withdrawal Successful</h3>
            <p className="mb-4">Your withdrawal has been processed.</p>
            <div className="flex gap-2">
              <button 
                onClick={handleGoToDashboard}
                className="px-4 py-2 bg-teal-600 text-white rounded"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleGoBackToWallet}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Back to Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}