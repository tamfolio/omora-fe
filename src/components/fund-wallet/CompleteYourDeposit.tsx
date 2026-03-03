"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiCopy, FiCheck, FiHeadphones } from "react-icons/fi";
import { CiBank } from "react-icons/ci";
import { useUserData } from "@/contexts/UserDataContext";

interface WalletDetails {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export default function CompleteYourDeposit() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "1,000,000";
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
  
  //  Get data from context instead of fetching
  const { userData, loading } = useUserData();

  useEffect(() => {
    if (userData) {
      const { wallets, user, business } = userData;
      
      // Find NGN wallet
      const ngnWallet = wallets?.find((w: any) => w.currency === 'NGN');
      
      if (ngnWallet) {
        //  Use business name for corporate accounts
        const accountName = business?.businessName || `${user.firstName} ${user.lastName}`;
        
        setWalletDetails({
          accountNumber: ngnWallet.accountNumber || '',
          bankName: ngnWallet.bankName || '',
          accountName: accountName
        });
      }
    }
  }, [userData]);

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-gray-500">Loading payment details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex flex-col">
      {/* Main Content */}
      <main className="max-w-lg mx-auto px-6 py-4 flex-1">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 animate-fade-in-up">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Complete your deposit
            </h1>
            <p className="text-sm text-gray-600">
              Use the following details to complete your payment.
            </p>
          </div>

          {/* Bank Transfer Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg flex items-center justify-center">
                  <CiBank className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Bank Transfer
                  </h3>
                  <p className="text-xs text-gray-600">Secure payment</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">
                  Total to pay
                </span>
                <p className="font-bold text-base text-gray-900">
                  NGN {parseFloat(amount).toLocaleString()}.00
                </p>
              </div>
            </div>

            {/* Form Fields */}
            {walletDetails ? (
              <div className="space-y-3">
                <div className="group">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Account number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={walletDetails.accountNumber}
                      readOnly
                      className="w-full py-2 text-gray-900 font-mono text-sm transition-colors duration-200"
                    />
                    <button
                      onClick={() => handleCopy(walletDetails.accountNumber, "account")}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-all duration-200"
                    >
                      {copiedField === "account" ? (
                        <FiCheck className="w-3 h-3 text-green-600" />
                      ) : (
                        <FiCopy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Bank
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={walletDetails.bankName}
                      readOnly
                      className="w-full py-2 text-gray-900 text-sm transition-colors duration-200"
                    />
                    <button
                      onClick={() => handleCopy(walletDetails.bankName, "bank")}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-all duration-200"
                    >
                      {copiedField === "bank" ? (
                        <FiCheck className="w-3 h-3 text-green-600" />
                      ) : (
                        <FiCopy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Account name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={walletDetails.accountName}
                      readOnly
                      className="w-full py-2 text-gray-900 text-sm transition-colors duration-200"
                    />
                    <button
                      onClick={() => handleCopy(walletDetails.accountName, "name")}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-all duration-200"
                    >
                      {copiedField === "name" ? (
                        <FiCheck className="w-3 h-3 text-green-600" />
                      ) : (
                        <FiCopy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Unable to load account details.</p>
                <p className="text-sm mt-2">Please refresh the page or contact support.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700">
          <FiHeadphones className="text-white text-lg" />
        </button>
      </div>
    </div>
  );
}