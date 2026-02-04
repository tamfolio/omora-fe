"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiHeadphones } from "react-icons/fi";
import Logo from "@/components/ui/Logo";
import PDFHelper from "./PDFHelper";

interface TransactionData {
  id: string;
  type: string;
  date: string;
  amount: string;
  fee: string;
  status: string;
  referenceId: string;
  // Specific fields based on transaction type
  walletAddress?: string;
  blockchain?: string;
  bankName?: string;
  accountNumber?: string;
  senderName?: string;
  receivingAccount?: string;
  conversion?: string;
  sourceWallet?: string;
  destinationWallet?: string;
  amountConverted?: string;
  fxRateUsed?: string;
  convertedValue?: string;
}

export default function TransactionReceipt() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get transaction data from URL params (in production, this would come from API)
  const transactionType = searchParams.get("type") || "funding";
  const transactionId = searchParams.get("id") || "1";

  // Mock transaction data - in production, fetch from API based on ID
  const getTransactionData = (): TransactionData => {
    const baseData = {
      id: transactionId,
      date: "02 Aug 2025, 19:08:07",
      amount: "₦2000",
      fee: "₦20",
      status: "Successful",
      referenceId: "#123456",
    };

    switch (transactionType.toLowerCase()) {
      case "funding":
        return {
          ...baseData,
          type: "Wallet Funding",
          senderName: "Anita Odiete",
          receivingAccount: "Omora",
        };

      case "withdrawal":
        if (searchParams.get("currency") === "USDT") {
          return {
            ...baseData,
            type: "USDT Withdrawal",
            walletAddress: "123****59",
            blockchain: "ERC",
          };
        } else {
          return {
            ...baseData,
            type: "NGN Withdrawal",
            bankName: "Stanbic IBTC",
            accountNumber: "1234567890",
          };
        }

      case "conversion":
        return {
          ...baseData,
          type: "Conversion",
          conversion: "NGN-USDT",
          sourceWallet: "NGN",
          destinationWallet: "USDT",
          amountConverted: "₦2000",
          fxRateUsed: "₦1 = $0.0000000063783",
          convertedValue: "$1.26",
        };

      default:
        return { ...baseData, type: "Unknown Transaction" };
    }
  };

  const transactionData = getTransactionData();

  const getPageTitle = () => {
    switch (transactionType.toLowerCase()) {
      case "funding":
        return "Funding Transaction Receipt";
      case "withdrawal":
        return searchParams.get("currency") === "USDT"
          ? "USDT Withdrawal Transaction Receipt"
          : "NGN Withdrawal Transaction Receipt";
      case "conversion":
        return "Conversion Transaction Receipt";
      default:
        return "Transaction Receipt";
    }
  };

  const renderTransactionSpecificFields = () => {
    switch (transactionType.toLowerCase()) {
      case "funding":
        return (
          <>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Sender&apos;s Name</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.senderName}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Receiving Account</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.receivingAccount}
              </span>
            </div>
          </>
        );

      case "withdrawal":
        if (searchParams.get("currency") === "USDT") {
          return (
            <>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Wallet Address</span>
                <span className="text-sm font-medium text-gray-900">
                  {transactionData.walletAddress}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Blockchain used</span>
                <span className="text-sm font-medium text-gray-900">
                  {transactionData.blockchain}
                </span>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Bank Name</span>
                <span className="text-sm font-medium text-gray-900">
                  {transactionData.bankName}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Account Number</span>
                <span className="text-sm font-medium text-gray-900">
                  {transactionData.accountNumber}
                </span>
              </div>
            </>
          );
        }

      case "conversion":
        return (
          <>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Conversion</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.conversion}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Source Wallet</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.sourceWallet}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Destination Wallet</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.destinationWallet}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Amount Converted</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.amountConverted}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">FX Rate Used</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.fxRateUsed}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Converted Value</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.convertedValue}
              </span>
            </div>
          </>
        );

      default:
        return null;
    }
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
        </div>
      </header>

      {/* Page Title */}
      <div className="text-center py-4">
        <h1 className="text-lg text-gray-500">{getPageTitle()}</h1>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Transaction Details
            </h1>
            <p className="text-gray-600">
              Enter amount and select currency to convert to
            </p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-0 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Transaction Date</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.date}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Transaction Type</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.type}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.amount}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Transaction Fee</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.fee}
              </span>
            </div>

            {/* Render transaction-specific fields */}
            {renderTransactionSpecificFields()}

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Reference ID</span>
              <span className="text-sm font-medium text-gray-900">
                {transactionData.referenceId}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">
                  {transactionData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <PDFHelper
            transactionData={transactionData}
            transactionType={transactionType}
          />
        </div>
      </main>
 {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
          <FiHeadphones className="text-white text-lg" />
        </button>
      </div>
    </div>
  );
}
