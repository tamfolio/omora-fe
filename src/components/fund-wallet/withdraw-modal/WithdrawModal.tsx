"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import USDTWithdrawModal from "./USDTWithdrawal";

interface WithdrawData {
  currency: "NGN" | "USDT";
  amount: number;
  serviceFee: number;
  bankAccount?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  walletAddress?: string;
  network?: string;
  description: string;
}

interface Bank {
  id: number;
  bankName: string;
  bankCode: string | null;
  country: string;
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (withdrawData: WithdrawData) => void;
  onGoToDashboard?: () => void;
  onGoBackToWallet?: () => void;
  initialCurrency?: "NGN" | "USDT";
}

const WITHDRAWAL_FEES = {
  NGN: 10,
  USDT: 0.5
};

const MIN_WITHDRAWAL = {
  NGN: 50000,
  USDT: 0.5
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
  const [amount, setAmount] = useState("2000");
  const [bankAccount, setBankAccount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [description, setDescription] = useState("");
  
  // Bank Data & Processing
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [isValidatingAccount, setIsValidatingAccount] = useState(false);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);

  // New Searchable Dropdown State
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showVerification, setShowVerification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingWithdrawData, setPendingWithdrawData] =
    useState<WithdrawData | null>(null);

  useEffect(() => {
    setSelectedCurrency(initialCurrency);
  }, [initialCurrency]);

  // Handle clicking outside the custom dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBankDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Fetch Banks on Mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch("/api/proxy/lookups/provider-banks"); 
        
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            const validBanks = json.data
              .filter((b: Bank) => b.bankCode !== null)
              .sort((a: Bank, b: Bank) => a.bankName.localeCompare(b.bankName));

            setBanks(validBanks);
            
            if (validBanks.length > 0) {
              setBankAccount(validBanks[0].bankName);
              setSelectedBankCode(validBanks[0].bankCode as string);
            }
          }
        } else {
          console.error("Failed to fetch live banks from API.");
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error);
      }
    };

    if (selectedCurrency === "NGN" && isOpen) {
      fetchBanks();
    }
  }, [selectedCurrency, isOpen]);

  // 2. Validate Account via API
  const validateAccountNumber = async (accountNum: string, currentBankCode: string) => {
    if (accountNum.length === 10 && selectedCurrency === "NGN" && currentBankCode) {
      setIsValidatingAccount(true);
      setAccountName(""); 

      try {
        const res = await fetch(`/api/proxy/payout/resolve-account`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountNumber: accountNum, 
            bankCode: currentBankCode
          })
        });

        if (!res.ok) throw new Error("Resolution failed");
        
        const responseData = await res.json();
        const resolvedName = responseData.data?.account_name || responseData.data?.accountName || "Account Name Found";
        setAccountName(resolvedName);
      } catch (error) {
        setAccountName("Account not found");
      } finally {
        setIsValidatingAccount(false);
      }
    }
  };

  const handleAccountNumberChange = (value: string) => {
    const numericValue = value.replace(/\D/g, ''); 
    setAccountNumber(numericValue);
    
    if (selectedCurrency === "NGN") {
      if (numericValue.length === 10) {
        validateAccountNumber(numericValue, selectedBankCode);
      } else {
        setAccountName(""); 
      }
    }
  };

  // Custom handler for selecting a bank from the dropdown list
  const handleBankSelect = (bank: Bank) => {
    setBankAccount(bank.bankName);
    setSelectedBankCode(bank.bankCode as string);
    setIsBankDropdownOpen(false);
    setBankSearchQuery(""); // Reset search after selection

    // Re-validate if a full account number is already typed
    if (accountNumber.length === 10) {
      validateAccountNumber(accountNumber, bank.bankCode as string);
    }
  };

  const handleCurrencyChange = (currency: "NGN" | "USDT") => {
    setSelectedCurrency(currency);
  };

  if (!isOpen) return null;

  if (selectedCurrency === "USDT") {
    return (
      <USDTWithdrawModal
        isOpen={isOpen}
        onClose={onClose}
        onWithdraw={onWithdraw}
        onCurrencyChange={handleCurrencyChange}
        onGoToDashboard={onGoToDashboard}
        onGoBackToWallet={onGoBackToWallet}
      />
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
      bankCode: selectedCurrency === "NGN" ? selectedBankCode : undefined,
      accountNumber: selectedCurrency === "NGN" ? accountNumber : undefined,
      accountName: selectedCurrency === "NGN" ? accountName : undefined,
      description,
    };

    setPendingWithdrawData(withdrawData);
    setWithdrawalError(null);
    setShowVerification(true);
  };

  const handleVerificationSuccess = async () => {
    if (!pendingWithdrawData) return;

    if (pendingWithdrawData.currency === "NGN") {
      setIsProcessingWithdrawal(true);
      setWithdrawalError(null);

      try {
       const payload = {
          amount: pendingWithdrawData.amount,
          bankCode: pendingWithdrawData.bankCode,         
          accountNumber: pendingWithdrawData.accountNumber, 
          accountName: pendingWithdrawData.accountName,     
          narration: pendingWithdrawData.description || "Wallet Withdrawal",
          reference: `OM-WD-${Date.now()}`
        };

       const res = await fetch(`/api/proxy/payout/naira`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || errData.error || "Withdrawal failed");
        }

        onWithdraw(pendingWithdrawData); 
        setShowVerification(false);
        setShowSuccess(true);
      } catch (error: any) {
        setWithdrawalError(error.message || "An error occurred during withdrawal");
      } finally {
        setIsProcessingWithdrawal(false);
      }
    }
  };

  const handleShowSuccess = () => setShowSuccess(true);

  const handleCloseVerification = () => {
    if (!isProcessingWithdrawal) {
      setShowVerification(false);
      setPendingWithdrawData(null);
      setWithdrawalError(null);
    }
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

  // Filter banks based on search query
  const filteredBanks = banks.filter((bank) =>
    bank.bankName.toLowerCase().includes(bankSearchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessingWithdrawal) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] max-h-[95vh] flex flex-col">
        <div className="p-5">
          
          {/* Header */}
          <div className="relative flex items-center justify-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Withdraw from your wallet</h2>
          </div>

          {/* Currency Tabs */}
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100 mb-5">
            <button className="flex-1 bg-white shadow-sm border border-gray-200 text-gray-900 py-1.5 text-sm font-semibold rounded-md transition-all">
              Naira
            </button>
            <button
              onClick={() => handleCurrencyChange("USDT")}
              className="flex-1 text-gray-500 py-1.5 text-sm font-medium rounded-md hover:text-gray-700 transition-all"
            >
              USDT
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Amount
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition-all"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Minimum withdrawal amount is {currencySymbol}{minAmount.toLocaleString()}
            </p>
            
            <div className="mt-2.5 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center">
              <span className="text-sm text-gray-500">Service Fee: <span className="text-gray-700 font-medium">{serviceFee} {currencyUnit}</span></span>
            </div>
          </div>

          {/* CUSTOM SEARCHABLE BANK DROPDOWN */}
          <div className="mb-4 relative" ref={dropdownRef}>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Bank account
            </label>
            
            {/* The Select Box Trigger */}
            <div 
              onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm cursor-pointer transition-all flex items-center justify-between hover:border-gray-300"
            >
              <span className={banks.length === 0 ? "text-gray-400" : "text-gray-900"}>
                {banks.length === 0 ? "Loading banks..." : bankAccount || "Select a bank"}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* The Dropdown Menu with Search */}
            {isBankDropdownOpen && banks.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search banks..."
                    value={bankSearchQuery}
                    onChange={(e) => setBankSearchQuery(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
                    onClick={(e) => e.stopPropagation()} // Prevent input click from closing dropdown
                    autoFocus
                  />
                </div>
                
                {/* Scrollable Bank List */}
                <ul className="max-h-56 overflow-y-auto">
                  {filteredBanks.length > 0 ? (
                    filteredBanks.map((bank) => (
                      <li
                        key={bank.id}
                        onClick={() => handleBankSelect(bank)}
                        className="px-3 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                      >
                        {bank.bankName}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-4 text-sm text-gray-500 text-center">
                      No banks found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Account Number & Name */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => handleAccountNumberChange(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition-all mb-1.5"
              placeholder="10 digits"
              maxLength={10}
            />
            
            {isValidatingAccount && (
              <p className="text-xs text-blue-600 mb-1.5 px-1">Resolving account details...</p>
            )}
            
            {accountName === "Account not found" && (
              <p className="text-xs text-red-600 mb-1.5 px-1">Account not found. Please check the number.</p>
            )}

            {accountName && accountName !== "Account not found" && !isValidatingAccount && (
              <div className="bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                <span className="text-sm text-gray-700">{accountName}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition-all"
            />
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={!accountName || accountName === "Account not found" || isValidatingAccount}
            className="w-full bg-[#008B8B] hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium transition-colors mb-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Withdraw
          </button>

          <p className="text-xs text-gray-500 text-center">
            NGN withdrawals are processed within 1 business day.
          </p>
        </div>
      </div>
      
      {/* Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">
              Verification Required
            </h3>
            <p className="mb-4 text-sm text-gray-600">Please verify your withdrawal request of ₦{parseFloat(amount).toLocaleString()}.</p>
            
            {withdrawalError && (
              <p className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded">{withdrawalError}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleVerificationSuccess}
                disabled={isProcessingWithdrawal}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded font-medium hover:bg-teal-700 disabled:opacity-70"
              >
                {isProcessingWithdrawal ? "Processing..." : "Verify & Send"}
              </button>
              <button
                onClick={handleCloseVerification}
                disabled={isProcessingWithdrawal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Withdrawal Successful
            </h3>
            <p className="mb-6 text-sm text-gray-600">Your withdrawal has been processed and is on the way.</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleGoToDashboard}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded font-medium hover:bg-teal-700"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleGoBackToWallet}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200"
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