"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiHeadphones } from "react-icons/fi";
import Logo from "@/components/ui/Logo";
import TransactionSuccessModal from "./TransactionalSuccessModal";

export default function ReviewTransaction() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromCurrency = searchParams.get("from") || "NGN";
  const toCurrency = searchParams.get("to") || "USDT";
  const amount = searchParams.get("amount") || "0";
  const toAmount = searchParams.get("toAmount") || "0";
  const rate = parseFloat(searchParams.get("rate") || "0");
  const fromId = parseInt(searchParams.get("fromId") || "0");
  const toId = parseInt(searchParams.get("toId") || "0");

  const [narration, setNarration] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const conversionFee = 0;

  const makePostRequest = async (endpoint: string, body: any) => {
    const response = await fetch(`/api/proxy${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const handleNext = async () => {
    setIsProcessing(true);
    try {
      let result;

      if (
        fromCurrency.toLowerCase() === "usdt" &&
        toCurrency.toLowerCase() === "ngn"
      ) {
        result = await makePostRequest("/payout/stables", {
          amount: parseFloat(amount),
          currency: fromCurrency.toLowerCase(),
          narration: narration || `Payout from ${fromCurrency}`,
        });
      } else {
        // Strict payload mapping for make-conversion
        result = await makePostRequest("/conversion/make-conversion", {
          amount: parseFloat(amount),
          fromId: fromId,
          toId: toId,
        });
      }

      if (result.status === "success" || result.statusCode === "00") {
        setIsSuccessModalOpen(true);
      } else {
        alert(result.message || "Transaction failed");
      }
    } catch (error) {
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSymbol = (code: string) => (code === "NGN" ? "₦" : "$");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
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
                Review Details
              </h2>
            </div>
            <div className="relative w-16 h-16">
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3"
                  strokeDasharray="80, 100"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">80%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Review Transaction
            </h1>
            <p className="text-gray-600">
              Please confirm your details before we process this
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Currency Pair</span>
              <span className="text-sm font-medium text-gray-900">
                {fromCurrency}-{toCurrency}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Amount Tendered</span>
              <span className="text-sm font-medium text-gray-900">
                {getSymbol(fromCurrency)}
                {parseFloat(amount).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Conversion Fee</span>
              <span className="text-sm font-medium text-gray-900">
                {getSymbol(fromCurrency)}
                {conversionFee}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Rate</span>
              <span className="text-sm font-medium text-gray-900">
                1 {fromCurrency} = {rate} {toCurrency}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Amount to Receive</span>
              <span className="text-sm font-bold text-teal-600">
                {getSymbol(toCurrency)}
                {parseFloat(toAmount).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Narration
            </label>
            <textarea
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="Add a note (Optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              rows={2}
            />
          </div>

          <button
            onClick={handleNext}
            disabled={isProcessing}
            className={`w-full ${isProcessing ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"} text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center`}
          >
            {isProcessing ? "Processing..." : "Confirm & Execute"}
          </button>
        </div>
      </main>

      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
          <FiHeadphones className="text-white text-lg" />
        </button>
      </div>

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
