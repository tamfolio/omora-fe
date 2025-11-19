"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import USDTWithdrawModal from "./USDTWithdrawal";

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

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (withdrawData: WithdrawData) => void;
  onGoToDashboard?: () => void;
  onGoBackToWallet?: () => void;
  initialCurrency?: "NGN" | "USDT";
}

// Mock account database - in production this would be an API call
const MOCK_ACCOUNTS: Record<string, string> = {
  "0157855500": "Anita Odiete Kikitos",
  "1234567890": "John Doe",
  "0987654321": "Jane Smith",
  "1122334455": "David Johnson",
  "5566778899": "Sarah Wilson",
};

const BANKS = [
  "Fidelity Bank",
  "Access Bank",
  "GTBank",
  "First Bank",
  "Zenith Bank",
  "UBA",
  "Stanbic IBTC",
  "Union Bank",
  "Wema Bank",
  "Sterling Bank",
];

const WITHDRAWAL_FEES = {
  NGN: 200,
  USDT: 5,
};

const MIN_WITHDRAWAL = {
  NGN: 50000,
  USDT: 10,
};

export default function WithdrawModal({
  isOpen,
  onClose,
  onWithdraw,
  onGoToDashboard,
  onGoBackToWallet,
  initialCurrency = "NGN",
}: WithdrawModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<"NGN" | "USDT">(
    initialCurrency
  );
  const [amount, setAmount] = useState("250000");
  const [bankAccount, setBankAccount] = useState("Fidelity Bank");
  const [accountNumber, setAccountNumber] = useState("0157855500");
  const [accountName, setAccountName] = useState("Anita Odiete Kikitos");
  const [description, setDescription] = useState("");
  const [isValidatingAccount, setIsValidatingAccount] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingWithdrawData, setPendingWithdrawData] =
    useState<WithdrawData | null>(null);

  useEffect(() => {
    setSelectedCurrency(initialCurrency);
  }, [initialCurrency]);

  // Function to validate account number and populate account name
  const validateAccountNumber = async (accountNum: string) => {
    if (accountNum.length === 10 && selectedCurrency === "NGN") {
      setIsValidatingAccount(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundAccount = MOCK_ACCOUNTS[accountNum];
      if (foundAccount) {
        setAccountName(foundAccount);
      } else {
        setAccountName("Account not found");
      }

      setIsValidatingAccount(false);
    }
  };

  const handleAccountNumberChange = (value: string) => {
    setAccountNumber(value);
    if (selectedCurrency === "NGN") {
      setAccountName("");
      validateAccountNumber(value);
    }
  };

  const handleCurrencyChange = (currency: "NGN" | "USDT") => {
    setSelectedCurrency(currency);
  };

  if (!isOpen) return null;

  // If USDT is selected, render the USDT modal
  if (selectedCurrency === "USDT") {
    return (
      <>
        <USDTWithdrawModal
          isOpen={isOpen}
          onClose={onClose}
          onWithdraw={onWithdraw}
          onCurrencyChange={handleCurrencyChange}
          onGoToDashboard={onGoToDashboard}
          onGoBackToWallet={onGoBackToWallet}
        />
      </>
    );
  }

  const serviceFee = WITHDRAWAL_FEES[selectedCurrency];
  const minAmount = MIN_WITHDRAWAL[selectedCurrency];
  const currencySymbol = selectedCurrency === "NGN" ? "₦" : "";
  const currencyUnit = selectedCurrency === "NGN" ? "NGN" : "USDT";

  const handleWithdraw = () => {
    const withdrawData: WithdrawData = {
      currency: selectedCurrency,
      amount: parseFloat(amount),
      serviceFee,
      bankAccount: selectedCurrency === "NGN" ? bankAccount : undefined,
      accountNumber: selectedCurrency === "NGN" ? accountNumber : undefined,
      accountName: selectedCurrency === "NGN" ? accountName : undefined,
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
    setPendingWithdrawData(null);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setPendingWithdrawData(null);
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
        // Close modal when clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl w-full max-w-sm">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Withdraw</h2>
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
            <button className="flex-1 px-3 py-2 text-sm font-medium bg-gray-100 text-gray-900">
              Naira
            </button>
            <div className="border-r border-gray-200"></div>
            <button
              onClick={() => handleCurrencyChange("USDT")}
              className="flex-1 px-3 py-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50"
            >
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
              placeholder={`Enter amount in ${currencyUnit}`}
            />
            <p className="text-xs text-gray-500 mt-0.5">
              Min: {currencySymbol}
              {minAmount.toLocaleString()}, Fee: {currencySymbol}
              {serviceFee} {currencyUnit}
            </p>
          </div>

          {/* Bank Details for NGN */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank
            </label>
            <div className="relative">
              <select
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white text-sm"
              >
                {BANKS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                placeholder="10 digits"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={accountName}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-sm"
                placeholder="Auto-populated"
              />
            </div>
          </div>
          {isValidatingAccount && (
            <p className="text-xs text-blue-600 -mt-2 mb-2">Validating...</p>
          )}
          {accountName === "Account not found" && (
            <p className="text-xs text-red-600 -mt-2 mb-2">Account not found</p>
          )}

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm"
              rows={2}
              placeholder="Optional note"
            />
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
            NGN processed within 1 business day
          </p>
        </div>
      </div>

      {/* Placeholder for Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Verification Required
            </h3>
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
            <h3 className="text-lg font-semibold mb-4">
              Withdrawal Successful
            </h3>
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
