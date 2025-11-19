"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import Logo from "@/components/ui/Logo";
import TransactionSuccessModal from "./TransactionalSuccessModal";

export default function ReviewTransaction() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get transaction details from URL params (would typically come from previous step)
  const fromCurrency = searchParams.get("from") || "NGN";
  const toCurrency = searchParams.get("to") || "USD";
  const amount = searchParams.get("amount") || "2000";
  const toAmount = searchParams.get("toAmount") || "1.26";

  const [purpose, setPurpose] = useState("General");
  const [narration, setNarration] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Mock calculated values - would come from previous step
  const conversionFee = 200;
  const rate = 0.0000000063783;
  const amountToReceive = 1.26;

  const handleNext = () => {
    // Process the transaction
    console.log("Processing transaction...", {
      fromCurrency,
      toCurrency,
      amount,
      conversionFee,
      rate,
      amountToReceive,
      purpose,
      narration,
    });

    // Show success modal instead of immediate navigation
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <Logo width={120} height={32} />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Step 2/2</p>
              <h2 className="text-lg font-semibold text-gray-700">
                Enter amount
              </h2>
            </div>
            {/* Circular Progress - 80% */}
            <div className="relative w-16 h-16">
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                {/* Background circle */}
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                {/* Progress circle (80% = 288 degrees) */}
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3"
                  strokeDasharray="80, 100"
                  strokeLinecap="round"
                />
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">80%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Review Transaction
            </h1>
            <p className="text-gray-600">
              Enter amount and select currency to convert to
            </p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Currency Pair</span>
              <span className="text-sm font-medium text-gray-900">
                {fromCurrency}-{toCurrency}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Amount Tendered</span>
              <span className="text-sm font-medium text-gray-900">
                ₦{parseInt(amount).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Conversion Fee</span>
              <span className="text-sm font-medium text-gray-900">
                ₦{conversionFee}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Rate</span>
              <span className="text-sm font-medium text-gray-900">
                ₦1 = ${rate.toFixed(12)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Amount to Receive</span>
              <span className="text-sm font-medium text-gray-900">
                ${toAmount}
              </span>
            </div>
          </div>

          {/* Narration Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Narration
            </label>
            <textarea
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="Enter a narration"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              rows={2}
            />
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Next
          </button>
        </div>
      </main>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
          <span className="text-white font-bold text-lg">J</span>
        </button>
      </div>

      {/* Transaction Success Modal */}
      <TransactionSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        conversionData={{
          fromCurrency,
          toCurrency,
          fromAmount: amount,
          toAmount: toAmount,
        }}
      />
    </div>
  );
}
